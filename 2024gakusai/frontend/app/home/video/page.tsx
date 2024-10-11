'use client'

import { useEffect, useRef, useState } from "react";
import { Socket,io } from "socket.io-client";

export default function Video() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const otherVideoRef = useRef<HTMLVideoElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const [videoStart,setVideoStart] = useState(false);
    const [videoJoin,setVideoJoin] = useState(false);
    function handleStartClick(){
        setVideoStart(!videoStart);
    }
    function handleJoinClick(){
        setVideoJoin(!videoJoin);
    }
    async function createStartpeer(stream:MediaStream):Promise<Socket>{
        const socket = io("http://localhost:8000");
        socket.on("connect",()=>{
            console.log("new user connected to signalink server");
        });
        const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" },{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"}],iceCandidatePoolSize: 0});
        const sdpOffer = await peer.createOffer();
        await peer.setLocalDescription(sdpOffer);
        if(stream instanceof MediaStream){
            stream.getTracks().forEach(track=> peer.addTrack(track,stream));
            console.log(stream);
        }
        socket.on("requireSdpOffer",()=>{
            socket.emit("sendSdp",JSON.stringify(sdpOffer));
        });
        socket.on("recievesdpAnswer",async(data)=>{
            console.log("recieved sdp answer");
            const sdpAnswer:RTCSessionDescriptionInit = JSON.parse(data); 
            if(sdpAnswer.type == "answer"){
                await peer.setRemoteDescription(sdpAnswer);
            }
            setTimeout(()=>{
                console.log(peer);
            },5000);
        });
        socket.on("recieveIceFromJoin",async(data)=>{
            const icecandidate :RTCIceCandidateInit[] = JSON.parse(data);
            for(const ice of icecandidate){
                await peer.addIceCandidate(ice);
            }
        });
        peer.onicecandidate = (event)=>{
            console.log("ice!!");
            if(event.candidate){
                socket.emit("sendIceFromStart",JSON.stringify(event.candidate));
            }
        }
        peer.oniceconnectionstatechange = () => {
            console.log("ICE connection state changed:", peer.iceConnectionState);
        }
        
        peer.ontrack = (e)=>{
            console.log("hoge");
            if(otherVideoRef.current){
                otherVideoRef.current.srcObject = e.streams[0] as MediaStream;
            }
        }
        return socket;
    }
    async function createJoinpeer(stream:MediaStream):Promise<Socket>{
        const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" },{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"}],iceCandidatePoolSize: 0});
        const socket = io("http://localhost:8000");
        if(stream instanceof MediaStream){
            stream.getTracks().forEach(track=> peer.addTrack(track,stream));
            console.log(stream);
        }
        socket.on("connect",()=>{
            console.log("connected to signalink server");
            socket.emit("requireSdpOffer",socket.id);
        });
        socket.on("recieveSdp",async(data)=>{
            const sdpOffer:RTCSessionDescriptionInit = JSON.parse(data);
            if(sdpOffer.type == "offer"){
                await peer.setRemoteDescription(sdpOffer);
                const sdpAnswer = await peer.createAnswer();
                await peer.setLocalDescription(sdpAnswer);
                console.log("recieved sdp");
                console.log(peer);
                socket.emit("sendsdpAnswer",JSON.stringify(sdpAnswer));
            }
        });
        socket.on("recieveIceFromStart",async(data)=>{
            const icecandidate:RTCIceCandidateInit[] = JSON.parse(data);
            for(const ice of icecandidate){
                await peer.addIceCandidate(ice);
            }
        });
        peer.onicecandidate = (event)=>{
            console.log("iceFromJoin");
            if(event.candidate){
                socket.emit("sendIceFromJoin",JSON.stringify(event.candidate));
            }
        }
        peer.addEventListener("icegatheringstatechange", () => {
            console.log("ICE gathering state changed:", peer.iceGatheringState);
        });
        peer.ontrack = (e)=>{
            console.log("icefromjoin");
            if(otherVideoRef.current){
                otherVideoRef.current.srcObject = e.streams[0];
            }
        }
        return socket;
    }
    useEffect(() => {
        async function getVideo() {
            if(videoStart || videoJoin){
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            height: 600,
                            width: 800,
                        },
                        audio: true,
                    });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    if(videoStart){
                        socketRef.current = await createStartpeer(stream);
                    }else if(videoJoin){
                        socketRef.current = await createJoinpeer(stream);
                    }
                } catch (error) {
                    console.error("Error accessing media devices.", error);
                }
            }
        }
        getVideo(); // 非同期処理を呼び出す
        return ()=>{
            socketRef.current?.disconnect();
        }
    }, [videoStart,videoJoin]);

    return (
        <>
            {!videoStart && !videoJoin && (<button onClick={handleStartClick}>ビデオを開始</button>)}
            {!videoStart && !videoJoin && (<button onClick={handleJoinClick}>ビデオに参加</button>)}
            {videoStart && (
                <>    
                    <div>
                        <p>my video</p>
                        <video ref={videoRef} autoPlay playsInline />
                    </div>
                    <div>
                        <p>other video</p>
                        <video ref={otherVideoRef} autoPlay playsInline/>
                    </div>
                </>
            )}
            {videoJoin && (
                <>    
                    <div>
                        <p>my video</p>
                        <video ref={videoRef} autoPlay playsInline />
                    </div>
                    <div>
                        <p>other video</p>
                        <video ref={otherVideoRef} autoPlay playsInline/>
                    </div>
                </>
            )}
        </>
    );
}
