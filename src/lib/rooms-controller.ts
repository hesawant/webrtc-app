import { Socket } from "socket.io";

import { Room, RoomImpl } from "./room";
import { parseJoinRoomMessage, parseLeaveRoomMessage } from "./validators";

export enum RoomsAction {
    JOIN_ROOM = "join-room",
    LEAVE_ROOM = "leave-room"
}

export interface RoomsController {
    createRoom(name?: string): Room;
    getRoomById(id: string): Room | undefined;
    getRoomByName(name: string): Room | undefined;
    deleteRoom(room: Room): void;
    joinRoom(socket: Socket, msgStr: string): void;
    leaveRoom(socket: Socket, msgStr: string): void;
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

    public joinRoom(socket: Socket, msgStr: string): void {
        let args = null;
        try {
            args = parseJoinRoomMessage(msgStr);
        } catch (e) {
            socket.emit(
                JSON.stringify({
                    ok: false,
                    type: RoomsAction.JOIN_ROOM,
                    error: "invalid_args",
                    message: e.message
                })
            );

            return;
        }

        let room = this.getRoomByName(args.name);

        if (!room) {
            room = this.createRoom(args.name);
        }

        const attendee = room.createAttendee(args.attendeeName);
        socket.join(room.getId());

        socket.emit(
            JSON.stringify({
                ok: true,
                type: RoomsAction.JOIN_ROOM,
                room,
                attendee
            })
        );
    }

    public leaveRoom(socket: Socket, msgStr: string): void {
        let args = null;
        try {
            args = parseLeaveRoomMessage(msgStr);
        } catch (e) {
            socket.emit(
                JSON.stringify({
                    ok: false,
                    type: RoomsAction.LEAVE_ROOM,
                    error: "invalid_args",
                    message: e.message
                })
            );

            return;
        }

        const room = this.getRoomById(args.id);

        if (!room) {
            socket.emit(
                JSON.stringify({
                    ok: false,
                    type: RoomsAction.LEAVE_ROOM,
                    error: "room_not_found"
                })
            );

            return;
        }

        socket.leave(room.getId());

        if (room.getAttendees().length === 0) {
            // When all attendees have left
            this.deleteRoom(room);
        }

        socket.emit(JSON.stringify({ ok: true, type: RoomsAction.LEAVE_ROOM }));
    }
}

const roomsController: RoomsController = new RoomsControllerImpl();

export function getRoomsController(): RoomsController {
    return roomsController;
}
