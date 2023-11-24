import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  boxes = [1, 2, 3, 4, 5, 6, 7];
  hoveredBox: number | null = null;
  private hoverSubject = new Subject<number>();

  constructor() {
    this.hoverSubject.pipe(debounceTime(200)).subscribe(index => {
      this.hoveredBox = index;
    });
  }

  onBoxHover(index: number): void {
    this.hoverSubject.next(index);
  }

  onBoxHoverOut(): void {
    this.hoverSubject.next(null);
  }
}
