"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
    }
});
io.on("connection", (socket) => {
    console.log(socket.id + "connected");
    io.emit("start", "tyurityuri");
    socket.emit("start", "hello");
    // SDPオファー要求イベント
    socket.on('requireSdpOffer', (msg) => {
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
        io.emit("recievesdpAnswer", msg);
    });
    // ICE候補送信イベント
    socket.on("sendIce", (msg) => {
        io.emit("recieveIce", msg);
    });
    // ICE候補送信（スタート時）
    socket.on("sendIceFromStart", (msg) => {
        console.log("sendIceFromStart event occurred");
        io.emit("recieveIceFromStart", msg);
    });
    socket.on("reconnect", () => {
        socket.emit("start", "helllo");
    });
    // 切断時の処理
    socket.on('disconnect', (reason) => {
        console.log("さよーならまたいつか!!" + reason);
    });
    // ICE候補送信（ジョイン時）
    socket.on("sendIceFromStart", (msg) => {
        io.emit("recieveIceFromJoin", msg);
    });
});
httpServer.listen(8000, () => {
    console.log("Server start on port 8000.");
});
