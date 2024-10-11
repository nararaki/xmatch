import exprss from "express";
import { createServer } from "http";
import { Server,Socket } from "socket.io";
const app = exprss();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:["http://localhost:3000"],
    }
})


io.on("connection", (socket:Socket) => {
    console.log(socket.id + "connected");
    io.emit("start","tyurityuri");
    socket.emit("start","hello");
    // SDPオファー要求イベント
    socket.on('requireSdpOffer', (msg:string) => {
        console.log("event occurred: " + msg);
        io.emit("requireSdpOffer", msg);
    });


    // SDP送信イベント
    socket.on("sendSdp", (msg) => {
        console.log("sendSdp event received");
        io.emit("recieveSdp", msg);
    });

    // SDP応答イベント
    socket.on("sendsdpAnswer", (msg) => {
        console.log("sendsdpAnswer occured")
        io.emit("recievesdpAnswer", msg);
    });

    // ICE候補送信イベント
    socket.on("sendIce", (msg) => {
        io.emit("recieveIce", msg);
    });

    // ICE
    socket.on("sendIceFromStart", (msg) => {
        console.log("sendIceFromStart event occurred");
        io.emit("recieveIceFromStart", msg);
    });

    socket.on("reconnect",()=>{
        socket.emit("start","helllo")
    })

    // 切断時の処理
    socket.on('disconnect', (reason) => {
        console.log("さよーならまたいつか!!"+ reason);
    });

    // ICE候補
    socket.on("sendIceFromStart", (msg) => {
        io.emit("recieveIceFromJoin", msg);
    });
});

httpServer.listen(8000, () => {
    console.log("Server start on port 8000.");
  });