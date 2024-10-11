package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server := socketio.NewServer(&socketio.ServerConfig{
		CORSAllowCredentials: true,
		CORSAllowOriginFunc: func(origin string) bool {
			return true // すべてのオリジンを許可
		},
	})
	fmt.Print("hoge")
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Print(s.ID() + "conneted\n")
		return nil
	})
	server.OnEvent("/", "requireSdpOffer", func(s socketio.Conn, msg string) {
		server.BroadcastToNamespace("/", "requireSdpOffer", msg)
		fmt.Print("event ocuured" + msg)
	})
	server.OnEvent("/", "sendSdp", func(s socketio.Conn, msg string) {
		server.BroadcastToNamespace("/", "recieveSdp", msg)
		log.Fatal("sendSdp")
	})
	server.OnEvent("/", "sendsdpAnswer", func(s socketio.Conn, msg string) {
		server.BroadcastToNamespace("/", "recievesdpAnswer", msg)
	})
	server.OnEvent("/", "sendIce", func(s socketio.Conn, msg string) {
		server.BroadcastToNamespace("/", "recieveIce", msg)
	})
	server.OnEvent("/", "sendIceFromStart", func(s socketio.Conn, msg string) {
		server.BroadcastToNamespace("/", "recieveIceFromStart", msg)
		log.Fatal("senIceFromStart")
	})
	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Print("さよーならまたいつか!!")
	})
	server.OnEvent("/", "sendIceFromStart", func(s socketio.Conn, msg string) {
		server.BroadcastToNamespace("/", "recieveIceFromJoin", msg)
	})
	go server.Serve()
	defer server.Close()
	http.Handle("/socket.io/", server)
	http.HandleFunc("/", handleCors)
	log.Println("server started at 8080")
	http.ListenAndServe(":8080", nil)
}

func handleCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // すべてのオリジンを許可
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
