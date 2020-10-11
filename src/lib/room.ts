import { v4 as uuidv4 } from "uuid";

import { Attendee, AttendeeId } from "./attendee";

export interface Room {
    getId(): string;
    getName(): string;
    getAttendees(): Attendee[];
    createAttendee(name: string): Attendee;
    removeAttendee(attendeeId: string): void;
}

export class RoomImpl implements Room {
    private id: string;
    private name: string;
    private attendeesMap: Map<AttendeeId, Attendee>;

    constructor(name?: string) {
        this.id = uuidv4();
        this.name = name || this.id;
        this.attendeesMap = new Map();
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    createAttendee(name: string): Attendee {
        const attendee = new Attendee(name);
        this.attendeesMap.set(attendee.getId(), attendee);
        return attendee;
    }

    getAttendees(): Attendee[] {
        return [...this.attendeesMap.values()];
    }

    removeAttendee(attendeeId: AttendeeId): void {
        this.attendeesMap.delete(attendeeId);
    }
}
