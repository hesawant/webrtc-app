import { JoinRoomMessage, LeaveRoomMessage, RoomMessage } from "./type";

export function parseJoinRoomMessage(arg: any): JoinRoomMessage {
    const msg = arg as JoinRoomMessage;

    if (!msg) {
        throw new Error("missing_args");
    }
    if (!msg.name) {
        throw new Error("empty_room_name");
    } else if (!msg.attendeeName) {
        throw new Error("empty_attendee_name");
    }

    return msg;
}

export function parseLeaveRoomMessage(arg: any): LeaveRoomMessage {
    const msg = arg as LeaveRoomMessage;

    if (!msg) {
        throw new Error("missing_args");
    } else if (!msg.id) {
        throw new Error("missing_room_id");
    } else if (!msg.attendeeId) {
        throw new Error("missing_attendee_id");
    }

    return msg;
}

export function parseRoomMessage(arg: any): RoomMessage | null {
    const msg = arg as RoomMessage;

    if (!msg) {
        return msg;
    } else if (!msg.id) {
        throw new Error("missing_room_id");
    } else if (!msg.attendeeId) {
        throw new Error("missing_attendee_id");
    }

    return msg;
}
