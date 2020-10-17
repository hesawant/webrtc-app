import { Socket } from "socket.io";

import { RoomsAction } from "./type";
import { Room, RoomImpl } from "./room";
import { parseJoinRoomMessage, parseLeaveRoomMessage, parseRoomMessage } from "./validators";

export interface RoomsController {
    createRoom(name?: string): Room;
    getRoomById(id: string): Room | undefined;
    getRoomByName(name: string): Room | undefined;
    deleteRoom(room: Room): void;
    joinRoom(socket: Socket, ...args: any[]): void;
    leaveRoom(socket: Socket, msgStr: string): void;
    roomMessage(socket: Socket, msgStr: string): void;
}

class RoomsControllerImpl {
    private roomMapById: { [key: string]: Room } = {};
    private roomMapByName: { [key: string]: Room } = {};

    public createRoom(name?: string): Room {
        const room = new RoomImpl(name);
        this.roomMapById[room.getId()] = room;
        this.roomMapByName[room.getName()] = room;
        return room;
    }

    public getRoomById(id: string): Room | undefined {
        return this.roomMapById[id];
    }

    public getRoomByName(name: string): Room | undefined {
        return this.roomMapByName[name];
    }

    public deleteRoom(room: Room): void {
        delete this.roomMapById[room.getId()];
        delete this.roomMapByName[room.getName()];
    }

    public joinRoom(socket: Socket, arg: any): void {
        let pArg = null;
        try {
            pArg = parseJoinRoomMessage(arg);
        } catch (e) {
            socket.emit(RoomsAction.JOIN_ROOM, {
                ok: false,
                error: "invalid_args",
                message: e.message
            });

            return;
        }

        let room = this.getRoomByName(pArg.name);

        if (!room) {
            room = this.createRoom(pArg.name);
        }

        const attendee = room.createAttendee(pArg.attendeeName, socket.id);
        socket.join(room.getId(), (error: any) => {
            if (error) {
                console.log(`Error joining room, socketId = ${socket.id}, error = ${JSON.stringify(error)}`);
            }
        });

        socket.emit(RoomsAction.JOIN_ROOM, {
            ok: true,
            type: RoomsAction.JOIN_ROOM,
            room: room.toJSONObject(),
            attendee
        });
    }

    public leaveRoom(socket: Socket, arg: any): void {
        let pArg = null;
        try {
            pArg = parseLeaveRoomMessage(arg);
        } catch (e) {
            socket.emit(RoomsAction.LEAVE_ROOM, {
                ok: false,
                error: "invalid_args",
                message: e.message
            });

            return;
        }

        const room = this.getRoomById(pArg.id);

        if (!room) {
            socket.emit(RoomsAction.LEAVE_ROOM, {
                ok: false,
                error: "room_not_found"
            });

            return;
        }

        socket.leave(room.getId());

        room.removeAttendee(pArg.attendeeId);

        if (room.getAttendees().length === 0) {
            // When all attendees have left
            this.deleteRoom(room);
        }

        socket.emit(RoomsAction.LEAVE_ROOM, { ok: true });
    }

    public roomMessage(socket: Socket, arg: any) {
        let pArg = null;
        try {
            pArg = parseRoomMessage(arg);
        } catch (e) {
            socket.emit(RoomsAction.MESSAGE, {
                ok: false,
                error: "invalid_args",
                message: e.message
            });

            return;
        }

        if (!pArg) return;

        const room = this.getRoomById(pArg.id);

        if (!room) {
            socket.emit(RoomsAction.LEAVE_ROOM, {
                ok: false,
                error: "room_not_found"
            });

            return;
        }

        if (pArg.desc) {
            socket.broadcast.to(room.getId()).emit(RoomsAction.MESSAGE, { desc: pArg.desc });
        }

        if (pArg.candidate) {
            socket.broadcast.to(room.getId()).emit(RoomsAction.MESSAGE, { candidate: pArg.candidate });
        }
    }
}

const roomsController: RoomsController = new RoomsControllerImpl();

export function getRoomsController(): RoomsController {
    return roomsController;
}
