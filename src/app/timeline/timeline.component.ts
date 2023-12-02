import { persiancalendarservice } from './../shared/services/persiancalendarservice.service';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { AddNewEventReminderComponent } from './add-new-event-reminder/add-new-event-reminder.component';
import { DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [persiancalendarservice]
})

export class TimelineComponent implements OnInit {
  displayedMonth: string = '';
  displayedYear: string = '';

  timelineItems: TimeLineItem[] = [];
  displayedTimeLine: TimeLineItem[] = [];
  isContentVisible = false;
  currentWeek = [1, 2, 3, 4, 5, 6, 7];
  hoveredBox: number | null = null;
  private hoverSubject = new Subject<number>();
  selectedBox: number | null = null;

  timeObjects: PersonalTimeObject[] = [
    { startTime: '12:15', priority: 'بالا', title: 'جلسه', type: 'event', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 2, dateTime: null },
    { startTime: '8:15', priority: 'عادی', title: 'جلسه', type: 'remainder', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 1, dateTime: null },
    { startTime: '12:15', priority: 'کم', title: 'جلسه', type: 'event', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 0, dateTime: null },
    { startTime: '12:15', priority: 'کم', title: 'جلسه', type: 'remainder', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 0, dateTime: null },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'remainder', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 1, dateTime: null },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 1, dateTime: null },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 1, dateTime: null },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 1, dateTime: null },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event', notes: '', daysBeforeToRemind: 7, remindByEmail: true, priorityLevel: 1, dateTime: null }
  ];

  historicalEvents: HistoricalEvent[] = [
    { dayNum: 1, event: 'آذر جشن' },
    { dayNum: 2, event: 'مبارزه غلیه زنان' },
    { dayNum: 3, event: 'نیروی دریایی' },
    { dayNum: 4, event: 'مجلس' },
    { dayNum: 5, event: 'روز دانشجو' },
    { dayNum: 10, event: 'روز حسابدار' },
    { dayNum: 15, event: 'روز پژوهش' },
    { dayNum: 25, event: 'روز ایدز' },
    { dayNum: 29, event: 'روز بیمه' },
    { dayNum: 29, event: 'روز بیمه' },
    { dayNum: 29, event: 'روز بیمه' },
    { dayNum: 29, event: 'روز بیمه' },
    { dayNum: 29, event: 'روز بیمه' },
    { dayNum: 29, event: 'روز بیمه' },
    { dayNum: 29, event: 'روز بیمه' },
  ];

  constructor(
    private el: ElementRef,
    public persiancalendarservice: persiancalendarservice,
    private matDialog: MatDialog) {
    this.hoverSubject.pipe(debounceTime(200)).subscribe(index => {
      this.hoveredBox = index;
    });
  }

  updateTimeLine(direction: string) {
    const updatedWeek: TimeLineItem[] = [];

    if (direction == 'up') {
      for (const item of this.displayedTimeLine) {
        const pastDate = new Date(item.date);
        pastDate.setDate(item.date.getDate() - 7);

        const WeekItem: TimeLineItem = {
          date: pastDate,
          dayName: item.dayName,
          dayNum: this.persiancalendarservice.returnPeaceOfDate(pastDate, 'day'),
        };

        updatedWeek.push(WeekItem)
      }
    }
    else {
      for (const item of this.displayedTimeLine) {
        const pastDate = new Date(item.date);
        pastDate.setDate(item.date.getDate() + 7);

        const WeekItem: TimeLineItem = {
          date: pastDate,
          dayName: item.dayName,
          dayNum: this.persiancalendarservice.returnPeaceOfDate(pastDate, 'day'),
        };

        updatedWeek.push(WeekItem)
      }
    }

    this.displayedTimeLine = updatedWeek;
  }

  ngOnInit() {
    this.generateTimeline();
    this.displayedTimeLine = this.timelineItems;
  }

  getJalaliDate(date: Date) {
    return this.persiancalendarservice.persiancalendar(date);
  }

  generateTimeline() {
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNum = this.persiancalendarservice.returnPeaceOfDate(date, 'day')
      const dayName = this.getDayName(date.getDay());

      this.timelineItems.push({ date, dayName, dayNum });
    }
  }

  getDayName(dayIndex: number): string {
    const daysOfWeek = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    return daysOfWeek[dayIndex];
  }

  openBox(index: number) {
    this.selectedBox = index;
  }

  closeBox(){
    this.selectedBox = null;
  }

  diplayedDate(date: Date, yyyy: boolean, mm: boolean, dd: boolean, dName: boolean) {
    let result: string = '';

    const day = this.persiancalendarservice.returnPeaceOfDate(date, 'day');
    const dayStr = this.getDayName(date.getDay());
    const month = this.persiancalendarservice.returnMonth(date);
    const year = this.persiancalendarservice.returnPeaceOfDate(date, 'year');

    if (dName) {
      result += dayStr + ' ';
    }

    if (dd) {
      result += day + ' ';
    }

    if (mm) {
      result += month + ' ';
    }

    if (yyyy) {
      result += year;
    }
    return result;
  }

  AddNewReminder() {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(AddNewEventReminderComponent, {
      data: new PersonalTimeObject({ dateTime: new Date() }),
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res)
        console.log(res);
      //success
      else
        console.log();
      //faile
    })
  }
}

export interface TimeLineItem {
  date: Date;
  dayName: string;
  dayNum: number;
}

export interface HistoricalEvent {
  dayNum: number;
  event: string;
}

export class PersonalTimeObject {
  startTime: string;
  priority: string;
  title: string;
  type: string;
  notes: string;
  daysBeforeToRemind: number;
  remindByEmail: boolean;
  priorityLevel: number;
  dateTime: Date;

  constructor(pto: any) {
    this.startTime = pto.startTime || null;
    this.priority = pto.priority || null;
    this.title = pto.title || null;
    this.type = pto.type || null;
    this.notes = pto.notes || null;
    this.daysBeforeToRemind = pto.daysBeforeToRemind || null;
    this.remindByEmail = pto.remindByEmail || null;
    this.priorityLevel = pto.priorityLevel || null;
    this.dateTime = pto.dateTime || null;
  }
}