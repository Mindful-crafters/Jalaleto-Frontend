export interface Reminder {
    reminderId: number;
    title: string;
    dateTime: Date;
    repeatInterval: number;
    priorityLevel: number;
    notes: string;
    status: number;
}