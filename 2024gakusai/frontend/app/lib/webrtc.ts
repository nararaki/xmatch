import { io,Socket } from "socket.io-client";
export async function createStartpeer(mediastream:MediaProvider | null | undefined):Promise<Socket>{
    const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }]});
    const sdpOffer = await peer.createOffer();
    await peer.setLocalDescription(sdpOffer);
    if(mediastream instanceof MediaStream){
        mediastream.getTracks().forEach(track=> peer.addTrack(track,mediastream));
    }
    peer.onicecandidate = (event) => {
        if(event.candidate){
            socket.emit("sendIce",JSON.stringify(event.candidate));
        }
    };
    const socket = io("localhost:8080/socket");
    socket.on("connect",()=>{
        console.log("new user connected to signalink server");
    });
    socket.on("requireSdpOffer",()=>{
        socket.emit("sendSdp",JSON.stringify(sdpOffer));
    });
    socket.on("sdpAnswer",async(data)=>{
        const sdpAnswer = new RTCSessionDescription(JSON.parse(data)); 
        await peer.setRemoteDescription(sdpAnswer);
    });
    return socket;
}

export async function createJoinpeer(mediastream:MediaProvider | null | undefined){
    const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }]});
    if(mediastream instanceof MediaStream){
        mediastream.getTracks().forEach(track=> peer.addTrack(track,mediastream));
    }
    const socket = io("localhost:8080/socket");
    socket.on("connect",()=>{
        console.log("connected to signalink server");
        socket.emit("requireSdpOffer",socket.id);
    });
    socket.on("recieveSdp",async(data)=>{
        const sdpOffer = new RTCSessionDescription(JSON.parse(data));
        await peer.setRemoteDescription(sdpOffer);
        const sdpAnswer = await peer.createAnswer();
        await peer.setLocalDescription(sdpAnswer);
        socket.emit("sdpAnswer",JSON.stringify(sdpAnswer));
    });
    socket.on("recieveIce",async(data)=>{
        const icecandidate = new RTCIceCandidate(JSON.parse(data));
        await peer.addIceCandidate(icecandidate).catch(console.error)
    })
    return socket;
}

export function cleanUpSocket(socket:Socket | null){
    if(socket){
        socket.off("connect")
        socket.off("message")
        socket.disconnect()
    }
}
