import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';
import { EventClass } from '../shared/types/EventObject.type';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.scss']
})
export class ShowEventsComponent implements OnInit {
  constructor(private dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: number,
    private restService: RestService, private toastr: ToastrService, private matDialog: MatDialog
  ) {

  }
  events: EventClass[] = [];
  isLoaded = false;
  ngOnInit(): void {
    this.FetchEvent();
  }

  FetchEvent() {
    this.isLoaded = false;
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

  OpenEventDetail(event: EventClass) {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(EventDetailComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      data: event
    })

    dialogRef.afterClosed().subscribe(() => {
      this.FetchEvent();
    })
  }

  jalaliDate(date: Date): string {
    const gregorianMoment = moment(date, 'YYYY-MM-DD');

    const jalaliDate = gregorianMoment.format('jYYYY-jMM-jDD');

    return jalaliDate;
  }
}
