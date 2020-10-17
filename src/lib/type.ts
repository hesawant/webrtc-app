export enum RoomsAction {
    JOIN_ROOM = "join-room",
    LEAVE_ROOM = "leave-room",
    MESSAGE = "message"
}

export interface JoinRoomMessage {
    name: string;
    attendeeName: string;
}

export interface LeaveRoomMessage {
    id: string;
    attendeeId: string;
}

export interface RoomMessage {
    id: string;
    attendeeId: string;
    desc?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidate;
}
