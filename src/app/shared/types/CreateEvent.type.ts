export interface CreateEvent{
    eventId : string;
    groupId:number;
    name:string;
    description:string;
    when:Date;
    location:string;
    memberLimit : number;
    tag : string[];
}