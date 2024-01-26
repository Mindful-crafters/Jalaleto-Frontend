import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.scss']
})
export class ShowEventsComponent implements OnInit {
  constructor(private dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: number,
    private restService: RestService, private toastr: ToastrService
  ) {

  }
  events: Event[] = [];
  isLoaded = false;
  ngOnInit(): void {
    this.restService.post('Group/GpInfo?GroupId=' + this.data, null).subscribe((res) => {
      if (res['success']) {
        this.events = res['data'][0].events;
        this.isLoaded = true;
      }
      else {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }

    })
  }

  Close() {
    this.dialogRef.close(null);
  }


}

export class Event {
  tag: string[];
  memberLimit: number;
  when: Date;
  groupId: number;
  eventId: number;
  name: string;
  description: string;

  constructor(event: Event) {
    this.tag = event.tag || null;
    this.memberLimit = event.memberLimit || null;
    this.when = event.when || null;
    this.groupId = event.groupId || null;
    this.eventId = event.eventId || null;
    this.name = event.name || null;
    this.description = event.description || null;
  }
}
