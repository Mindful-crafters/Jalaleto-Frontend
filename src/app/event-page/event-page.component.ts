import { Component, OnInit } from '@angular/core';
import { EventClass } from '../shared/types/EventObject.type';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'jalali-moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit {
  selectedEvent: EventClass = null;
  joinedEvents: EventClass[] = [];
  makedEvents: EventClass[] = [];
  joinedEventsLoading: boolean = false
  makedEventsLoading: boolean = false

  constructor(private restService: RestService, private toastr: ToastrService,
    private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.FetchEvents();
  }

  FetchEvents() {
    this.joinedEventsLoading = true;
    this.makedEventsLoading = true;

    this.restService.post('Event/Info', { from: '2020-01-27T18:29:42.459Z', to: '2026-01-27T18:29:42.459Z' }).subscribe((res) => {
      if (res['success']) {
        console.log(res);

        this.joinedEvents = res['data'];

        this.makedEvents = this.joinedEvents.filter(e => e.maked);

        this.joinedEventsLoading = false;
        this.makedEventsLoading = false;
      }
      else
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
    })
  }

  jalaliDate(date: Date): string {
    const gregorianMoment = moment(date, 'YYYY-MM-DD');

    const jalaliDate = gregorianMoment.format('jYYYY-jMM-jDD');

    return jalaliDate;
  }

  OpenEvent(event: EventClass) {
    this.selectedEvent = event;
  }

  CalculateTime(date: Date) {
    return this.datePipe.transform(date, 'HH:mm');

  }

}
