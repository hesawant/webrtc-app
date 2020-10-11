import * as SocketIO from "socket.io";
import * as HTTP from "http";
import * as express from "express";

import { RoomsAction, getRoomsController } from "@lib/rooms-controller";

//@ts-ignore
const app: express.Application = new express();

const http = HTTP.createServer(app);
const socketIO = new SocketIO(http);

app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/index.html");
});

socketIO.on("connection", socket => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("a user disconnected.");

        // TODO: hsawant implement removing a disconnected attendee from room.
    });

    socket.on(RoomsAction.JOIN_ROOM, (msgStr: string) => {
        getRoomsController().joinRoom(socket, msgStr);
    });

    socket.on(RoomsAction.LEAVE_ROOM, (msgStr: string) => {
        getRoomsController().leaveRoom(socket, msgStr);
    });

    socket.on("message", (msg: string) => {
        // Broadcast to everyone except the sender
        socket.broadcast.emit("message", msg);
    });
});

http.listen(3001, () => {
    console.log("listening on *:3001");
});
