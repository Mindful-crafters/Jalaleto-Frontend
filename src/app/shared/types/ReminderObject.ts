export class ReminderObject {
  title: string;
  dateTime: Date;
  daysBeforeToRemind: number;
  remindByEmail: boolean;
  repeatInterval: number;
  priorityLevel: number;
  notes: string;

  constructor(pto: any) {
    this.title = pto.title || null;
    this.dateTime = pto.dateTime || null;
    this.daysBeforeToRemind = pto.daysBeforeToRemind || null;
    this.remindByEmail = pto.remindByEmail || null;
    this.repeatInterval = pto.repeatInterval || null;
    this.priorityLevel = pto.priorityLevel || null;
    this.notes = pto.notes || null;
  }
}