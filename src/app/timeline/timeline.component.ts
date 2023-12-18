import { persiancalendarservice } from './../shared/services/persiancalendarservice.service';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { AddNewEventReminderComponent } from './add-new-event-reminder/add-new-event-reminder.component';
import { DialogRef } from '@angular/cdk/dialog';
import { RestService } from '../shared/services/Rest.service';
import { AuthService } from '../shared/services/auth.service';
import { ReminderObject } from '../shared/types/ReminderObject';


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
  firstDayOfTimeline: Date;

  hoveredBox: number | null = null;
  private hoverSubject = new Subject<number>();
  selectedBox: number | null = 0;

  weekReminders: ReminderObject[];

  selectedDayReminders: ReminderObject[];

  constructor(
    private el: ElementRef,
    private restService: RestService,
    private auth: AuthService,
    public persiancalendarservice: persiancalendarservice,
    private matDialog: MatDialog) {
    this.hoverSubject.pipe(debounceTime(200)).subscribe(index => {
      this.hoveredBox = index;
    });
  }

  updateTimeLine(direction: string) {
    const updatedWeek: TimeLineItem[] = [];

    if (direction == 'up') {
      this.firstDayOfTimeline.setDate(this.firstDayOfTimeline.getDate() - 7);
      this.openBox(0);
      this.getWeekReminders(this.firstDayOfTimeline);

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
      this.firstDayOfTimeline.setDate(this.firstDayOfTimeline.getDate() + 7);
      this.openBox(0);
      this.getWeekReminders(this.firstDayOfTimeline);

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

    const today = new Date();
    this.firstDayOfTimeline = today;
    this.getWeekReminders(today);
    this.openBox(0);
  }

  getWeekReminders(firstDate: Date) {
    const currentDate = new Date(firstDate);
    currentDate.setHours(3, 30, 0, 0);

    const firstday = currentDate.toISOString();

    const lastDay = new Date(firstDate)
    lastDay.setDate(firstDate.getDate() + 7);
    lastDay.setHours(3, 29, 59, 999);

    const lastday = lastDay.toISOString();

    const body = {
      "from": firstday,
      "to": lastDay
    }

    this.restService.post('Reminder/Info', body).subscribe(res => {
      this.weekReminders = res['data'];
    })
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

  MiladiToShamsi(date: Date) {
    const dateObject = new Date(date);
    return (this.persiancalendarservice.returnPeaceOfDate(dateObject, 'day'));
  }

  getDayName(dayIndex: number): string {
    const daysOfWeek = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    return daysOfWeek[dayIndex];
  }

  openBox(index: number) {
    this.selectedBox = index;

    const currentDate = new Date(this.firstDayOfTimeline);
    currentDate.setDate(this.firstDayOfTimeline.getDate() + index)
    currentDate.setHours(3, 30, 0, 0);

    const firstday = currentDate.toISOString();

    const endOfDay = new Date(this.firstDayOfTimeline)
    endOfDay.setDate(this.firstDayOfTimeline.getDate() + 1 + index);
    endOfDay.setHours(3, 29, 59, 999);

    const lasOftday = endOfDay.toISOString();

    const body = {
      "from": firstday,
      "to": lasOftday
    }

    console.log(body)

    this.restService.post('Reminder/Info', body).subscribe(res => {
      this.selectedDayReminders = res['data'];
      console.log(res)
    })
  }

  hourAndMinute(IsoDate) {
    const date = new Date(IsoDate);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour}:${minute}`;
  }

  closeBox() {
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

  AddNewReminder(type: string) {
    const selectedDay = new Date(this.firstDayOfTimeline);
    selectedDay.setDate(this.firstDayOfTimeline.getDate() + this.selectedBox)

    console.log(selectedDay);

    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(AddNewEventReminderComponent, {
      data: {
        data: new ReminderObject({ dateTime: selectedDay }),
        type: type
      },

      disableClose: true,
      hasBackdrop: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log(res);

        this.getWeekReminders(this.firstDayOfTimeline);
        this.openBox(this.selectedBox);
      }

      else
        console.log();
    })
  }

  reminderQuickCreate() {

  }

  starsArray(num: number): number[] {
    const array = [1];
    for (let index = 0; index < num; index++) {
      array.push(1)
    }
    return array;
  }
}

export interface TimeLineItem {
  date: Date;
  dayName: string;
  dayNum: number;
  reminders?: ReminderObject[];
}

export interface HistoricalEvent {
  dayNum: number;
  event: string;
}