import { persiancalendarservice } from './../shared/services/persiancalendarservice.service';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [persiancalendarservice]
})

export class TimelineComponent implements OnInit {
  displayedMonth: string = '';
  displayedYear : string = '';

  timelineItems: TimeLineItem[] = [];
  displayedTimeLine: TimeLineItem[] = [];
  isContentVisible = false;
  currentWeek = [1, 2, 3, 4, 5, 6, 7];
  hoveredBox: number | null = null;
  private hoverSubject = new Subject<number>();
  selectedBox: number | null = null;

  timeObjects: PersonalTimeObject[] = [
    { startTime: '12:15', priority: 'بالا', title: 'جلسه', type: 'event' },
    { startTime: '8:15', priority: 'عادی', title: 'جلسه', type: 'remainder' },
    { startTime: '12:15', priority: 'کم', title: 'جلسه', type: 'event' },
    { startTime: '12:15', priority: 'کم', title: 'جلسه', type: 'remainder' },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'remainder' },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event' },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event' },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event' },
    { startTime: '12:15', priority: 'عادی', title: 'جلسه', type: 'event' }
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
    public persiancalendarservice: persiancalendarservice) {
    this.hoverSubject.pipe(debounceTime(200)).subscribe(index => {
      this.hoveredBox = index;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.selectedBox !== null && !this.isClickInsideBigBox(event)) {
      this.selectedBox = null;
    }
  }

  toggleSize(index: number): void {
    this.selectedBox = index;
  }

  private isClickInsideBigBox(event: MouseEvent): boolean {
    const bigBox = this.el.nativeElement.querySelector('.box.big');
    return bigBox ? bigBox.contains(event.target as Node) : false;
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

  isOpen() {

  }

  getJalaliDate(date: Date) {
    return this.persiancalendarservice.persiancalendar(date);
  }

  generateTimeline() {
    const today = new Date();
    console.log(this.persiancalendarservice.returnPeaceOfDate(today, 'day'))

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

  onBoxHover(index: number): void {
    this.hoverSubject.next(index);
  }

  onBoxHoverOut(): void {
    this.hoverSubject.next(null);
  }

  diplayedDate(date : Date , yyyy : boolean , mm : boolean , dd : boolean){
    let result : string = '';

    const day = this.persiancalendarservice.returnPeaceOfDate(date, 'day');
    const month = this.persiancalendarservice.returnMonth(date);
    const year = this.persiancalendarservice.returnPeaceOfDate(date, 'year');

    if(dd){
      result+= day + ' ';
    }

    if(mm){
      result += month + ' ';
    }

    if(yyyy){
      result += year;
    }
    return result;
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

export interface PersonalTimeObject {
  startTime: string;
  priority: string;
  title: string;
  type: string;
}