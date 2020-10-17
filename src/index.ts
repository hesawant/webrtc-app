import * as SocketIO from "socket.io";
import * as HTTP from "http";
import * as express from "express";

import { RoomsAction } from "./lib/type";
import { getRoomsController } from "./lib/rooms-controller";

//@ts-ignore
const app: express.Application = new express();

const http = HTTP.createServer(app);
const socketIO = new SocketIO(http);

app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/index.html");
});

socketIO.on("connection", socket => {
    console.log("a user connected ", socket.id);

    socket.on("disconnecting", () => {
        console.log("a user disconnecting ", socket.id);

        const roomIds = socket.rooms;

        Object.keys(roomIds).forEach(roomId => {
            const room = getRoomsController().getRoomById(roomId);
            if (room) {
                room.removeAttendeeBySocketId(socket.id);
            }
        });
    });

    socket.on(RoomsAction.JOIN_ROOM, (arg: any) => {
        getRoomsController().joinRoom(socket, arg);
    });

    socket.on(RoomsAction.LEAVE_ROOM, (arg: any) => {
        getRoomsController().leaveRoom(socket, arg);
    });

    socket.on(RoomsAction.MESSAGE, (msg: string) => {
        getRoomsController().roomMessage(socket, msg);
    });
});

http.listen(3001, () => {
    console.log("listening on *:3001");
});
