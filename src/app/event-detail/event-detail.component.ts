import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventClass } from '../shared/types/EventObject.type';
import * as moment from 'jalali-moment';
import { DatePipe } from '@angular/common';
import { RestService } from '../shared/services/Rest.service';
import { UserProfile } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  constructor(private dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: EventClass,
    private datePipe: DatePipe, private restService: RestService,
    private toastr: ToastrService) {

  }
  isLoaded: boolean = false;
  userProfile: any = null;
  isMember: boolean = false;
  ngOnInit(): void {
    this.fetchUserProfile();
  }

  Close() {
    this.dialogRef.close(null);
  }

  jalaliDate(date: Date): string {
    // Parse the Gregorian date using moment.js

    const gregorianMoment = moment(date, 'YYYY-MM-DD');

    // Convert to Jalali date
    const jalaliDate = gregorianMoment.format('jYYYY-jMM-jDD');

    return jalaliDate;
  }

  CalculateTime(date: Date) {
    return this.datePipe.transform(date, 'HH:mm');

  }

  fetchUserProfile() {
    this.restService.post("User/ProfileInfo", null).subscribe(
      (data) => {
        console.log(data);

        if (data['success']) {
          this.userProfile = data;
          this.isLoaded = true;
          const b = this.data.members.find(m => m.mail == this.userProfile.email)
          if (b)
            this.isMember = true;
          else
            this.isMember = false;
        }
        else
          this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }

    );
  }

  JoinToEvent() {
    this.restService.post('Event/Join?groupId=' + this.data.groupId + '&eventId=' + this.data.eventId, null).subscribe((res) => {
      console.log(res);

      if (res['success']) {
        this.toastr.success('با موفقیت عضو رویداد شدید', 'موفقیت');
        this.dialogRef.close(null);
      }
      else if (res['message'] == 'cant join event before joining group of that event') {
        this.toastr.error('ابتدا در گروه عضو شوید', 'خطا')
      }
      else {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }
    })
  }
}
