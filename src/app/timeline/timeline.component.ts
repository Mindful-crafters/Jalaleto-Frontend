import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})

export class TimelineComponent implements OnInit {
  timelineItems : TimeLineItem[] = [];

  constructor() {
    this.hoverSubject.pipe(debounceTime(200)).subscribe(index => {
      this.hoveredBox = index;
    });
  }

  ngOnInit() { 
    this.generateTimeline();
  }

  generateTimeline() {
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNum = date.getDate(); // Extract the day of the month
      const dayName = this.getDayName(date.getDay());

      this.timelineItems.push({ date, dayName , dayNum });
    }
  }

  getDayName(dayIndex: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  }

  boxes = [1, 2, 3, 4, 5, 6, 7];
  hoveredBox: number | null = null;
  private hoverSubject = new Subject<number>();


  onBoxHover(index: number): void {
    this.hoverSubject.next(index);
  }

  onBoxHoverOut(): void {
    this.hoverSubject.next(null);
  }
}

export interface TimeLineItem{
  date : Date;
  dayName : string;
  dayNum : number;
}
