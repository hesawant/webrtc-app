import { v4 as uuidv4 } from "uuid";

export type AttendeeId = string;

export class Attendee {
    private id: AttendeeId;
    private name: string;
    private socketId: string;

    constructor(name: string, socketId: string) {
        this.id = uuidv4();
        this.name = name;
        this.socketId = socketId;
    }

    public getId(): AttendeeId {
        return this.id;
    }

    public getSocketId(): string {
        return this.socketId;
    }
}
