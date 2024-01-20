import { Member } from "./Member";

export interface EventObject {
    groupId: number;
    eventId: string;
    name: string;
    description: string;
    when: Date;
    members : Member[];
    memberLimit: number;
    tag: string[];
}