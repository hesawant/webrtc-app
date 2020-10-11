import { v4 as uuidv4 } from "uuid";

export type AttendeeId = string;

export class Attendee {
    private id: AttendeeId;
    private name: string;

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
    }

    public getId(): AttendeeId {
        return this.id;
    }
}
