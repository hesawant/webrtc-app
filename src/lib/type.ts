export interface JoinRoomMessage {
    name: string;
    attendeeName: string;
}

export interface LeaveRoomMessage {
    id: string;
    attendeeId: string;
}
