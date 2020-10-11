import { JoinRoomMessage, LeaveRoomMessage } from "@common/type";

export function parseJoinRoomMessage(msgString: string): JoinRoomMessage {
    const msg = JSON.parse(msgString) as JoinRoomMessage;

    if (!msg.name) {
        throw new Error("empty_room_name");
    } else if (!msg.attendeeName) {
        throw new Error("empty_attendee_name");
    }

    return msg;
}

export function parseLeaveRoomMessage(msgString: string): LeaveRoomMessage {
    const msg = JSON.parse(msgString) as LeaveRoomMessage;

    if (!msg.id) {
        throw new Error("missing_room_id");
    } else if (!msg.attendeeId) {
        throw new Error("missing_attendee_id");
    }

    return msg;
}
