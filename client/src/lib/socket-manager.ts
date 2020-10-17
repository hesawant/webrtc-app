import * as io from "socket.io-client";

import { RoomsAction } from "./type";

export class SocketManager {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect("http://localhost:3001");

        this.socket.on("connection", () => {
            console.log("Socket connected");
        });
    }

    public send(type: RoomsAction, arg: any) {
        this.socket.emit(type, arg);
    }

    public recv(type: RoomsAction, callback: (arg: any) => void) {
        this.socket.on(type, (arg: any) => callback(arg));
        console.log(type + " receive listener added");
    }
}
