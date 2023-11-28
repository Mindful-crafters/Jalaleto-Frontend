import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})

export class TimelineComponent implements OnInit {
  timelineItems: TimeLineItem[] = [];
  displayedTimeLine: TimeLineItem[] = [];
  isContentVisible = false;
  currentWeek = [1, 2, 3, 4, 5, 6, 7];
  hoveredBox: number | null = null;
  private hoverSubject = new Subject<number>();

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
  ];

  constructor() {
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
          dayNum: pastDate.getDate(),
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
          dayNum: pastDate.getDate(),
        };

        updatedWeek.push(WeekItem)
      }
    }

    this.displayedTimeLine = updatedWeek;
    console.log(this.displayedTimeLine)
  }

  ngOnInit() {
    this.generateTimeline();
    this.displayedTimeLine = this.timelineItems;
  }

  isOpen() {

  }

  generateTimeline() {
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNum = date.getDate(); // Extract the day of the month
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