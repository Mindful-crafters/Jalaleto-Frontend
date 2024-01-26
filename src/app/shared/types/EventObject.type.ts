import { Member } from "./Member";

export interface EventObject {
    groupId: number;
    eventId: string;
    name: string;
    description: string;
    when: Date;
    members: Member[];
    memberLimit: number;
    tag: string[];
}

export class EventClass {
    tag: string[];
    memberLimit: number;
    when: Date;
    groupId: number;
    eventId: number;
    name: string;
    description: string;
    members: MemberEvent[];

    constructor(event: any) {
        this.tag = event.tag || null;
        this.memberLimit = event.memberLimit || null;
        this.when = event.when || null;
        this.groupId = event.groupId || null;
        this.eventId = event.eventId || null;
        this.name = event.name || null;
        this.description = event.description || null;
        this.members = event.members || [];
    }
}

export class MemberEvent {
    mail: string;
    firstName: string;
    lastName: string;
    userName: string;
    birthday: Date;
    image: string;

    constructor(memberEvent: any) {
        this.mail = memberEvent.mail || null;
        this.firstName = memberEvent.firstName || null;
        this.lastName = memberEvent.lastName || null;
        this.userName = memberEvent.userName || null;
        this.birthday = memberEvent.birthday || null;
        this.image = memberEvent.image || null;
    }
}