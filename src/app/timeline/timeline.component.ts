import { persiancalendarservice } from './../shared/services/persiancalendarservice.service';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { AddNewEventReminderComponent } from './add-new-event-reminder/add-new-event-reminder.component';
import { DialogRef } from '@angular/cdk/dialog';
import { RestService } from '../shared/services/Rest.service';
import { AuthService } from '../shared/services/auth.service';
import { ReminderObject } from '../shared/types/ReminderObject';
import { DatePipe } from '@angular/common';
import { ReminderDialogComponent } from './reminder-dialog/reminder-dialog/reminder-dialog.component';
import { PostEventComponent } from '../post-event/post-event.component';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [persiancalendarservice]
})

export class TimelineComponent implements OnInit {
  quickDate: Date;
  timelineItems: TimeLineItem[] = [];
  displayedTimeLine: TimeLineItem[] = [];
  currentWeek = [1, 2, 3, 4, 5, 6, 7];
  firstDayOfTimeline: Date;
  selectedBox: number | null = 0;
  weekReminders: ReminderObject[];
  selectedDayReminders: ReminderObject[];

  constructor(
    private el: ElementRef,
    private restService: RestService,
    private auth: AuthService,
    private datePipe: DatePipe,
    public persiancalendarservice: persiancalendarservice,
    private matDialog: MatDialog) {
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

    this.restService.post('Reminder/Info', body).subscribe(res => {
      this.selectedDayReminders = res['data'];
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

  AddNewReminder() {
    const selectedDay = new Date(this.firstDayOfTimeline);
    selectedDay.setDate(this.firstDayOfTimeline.getDate() + this.selectedBox)

    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(PostEventComponent, {
      data: {
        data: new ReminderObject({ dateTime: selectedDay }),
      },

      disableClose: true,
      hasBackdrop: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((res) => {
      console.log('dialog is closed')
      if (res) {
        console.log('done!')
        this.getWeekReminders(this.firstDayOfTimeline);
        this.openBox(this.selectedBox);
        console.log('selected box : ',this.selectedBox)
      }

      else
        console.log('not done');
    })
  }

  openReminderBox(index: number) {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(ReminderDialogComponent, {
      data: {
        reminder: this.selectedDayReminders[index]
      },

      disableClose: true,
      hasBackdrop: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

      }

      else { }
    })
  }

  starsArray(num: number): number[] {
    const array = [1];
    for (let index = 0; index < num; index++) {
      array.push(1)
    }
    return array;
  }

  fastDateNavigate() {
    if (this.quickDate == null) {
      console.log('date is null')
      return;
    }

    const localDateTime = new Date(this.quickDate);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const gmtDateTimeString = this.datePipe.transform(localDateTime, 'yyyy-MM-dd HH:mm:ss', 'GMT');
    const gmtDateTime = new Date(gmtDateTimeString);
    gmtDateTime.setDate(gmtDateTime.getDate() + 1);

    const sourceHour = this.firstDayOfTimeline.getHours();
    const sourceMinute = this.firstDayOfTimeline.getMinutes();

    gmtDateTime.setHours(sourceHour)
    gmtDateTime.setMinutes(sourceMinute)

    this.firstDayOfTimeline = gmtDateTime;
    const updatedWeek: TimeLineItem[] = [];
    console.log('f', this.firstDayOfTimeline)

    for (let index = 0; index < 7; index++) {
      const currentDate = new Date(this.firstDayOfTimeline);
      currentDate.setDate(currentDate.getDate() + index);

      const dayNum = this.persiancalendarservice.returnPeaceOfDate(currentDate, 'day')
      const dayName = this.getDayName(currentDate.getDay());

      const WeekItem: TimeLineItem = {
        date: currentDate,
        dayName: dayName,
        dayNum: dayNum,
      };

      console.log(WeekItem)
      console.log('weekday', this.diplayedDate(currentDate, false, false, false, true))
      console.log('year and month', this.diplayedDate(currentDate, true, true, false, false))

      updatedWeek.push(WeekItem)
    }

    console.log(updatedWeek);
    this.displayedTimeLine = updatedWeek;
    this.openBox(0);
    this.getWeekReminders(this.firstDayOfTimeline);
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