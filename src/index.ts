import * as SocketIO from "socket.io";
import * as HTTP from "http";
import * as express from "express";

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
    });

    socket.on("message", (msg: string) => {
        // Broadcast to everyone except the sender
        socket.broadcast.emit("message", msg);
    });
});

http.listen(3001, () => {
    console.log("listening on *:3001");
});
