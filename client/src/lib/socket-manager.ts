import * as io from "socket.io-client";

export class SocketManager {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect("http://localhost:3001");

        this.socket.on("connection", () => {
            console.log("Socket connected");
        });
    }

    public send(msg: string) {
        this.socket.emit("message", msg);
    }

    public recv(callback: (msg: string) => void) {
        this.socket.on("message", (msg: string) => callback(msg));
    }
}
