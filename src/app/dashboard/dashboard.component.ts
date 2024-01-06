import { AuthService } from './../shared/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../shared/services/Rest.service';
import * as moment from 'jalali-moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isLoggedIn = false;

  private dayArray = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشبه', 'پنجشنبه', 'جمعه', 'شنبه'];

  private date = new Date();
  public hour: any;
  public minute: string;
  public second: string;
  public ampm: string;
  public day: string;
  public month: string;
  public jalaliMonth;
  public jalaliYear;
  public jalaliDay;

  ngOnInit() {
    const token = '';
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000)
    this.day = this.dayArray[this.date.getDay()];
    this.jalaliMonth = moment().locale('fa').format('jMMMM');
    const jalali = moment().locale('fa');
    this.jalaliYear = jalali.jYear();
    this.jalaliDay = jalali.date();
    this.restService.post("User/LandingInfo", null).subscribe((res: LandingResult) => {

      this.data.UsersCount = res.usersCount;
      this.data.GroupCount = res.groupCount;
      this.data.EventCount = res.eventCount;
      this.data.ReminderCount = res.reminderCount;
    });
  }

  private updateDate(date: Date) {
    const hours = date.getHours();
    this.ampm = hours >= 12 ? 'PM' : 'AM';
    this.hour = hours % 12;
    this.hour = this.hour ? this.hour : 12;
    this.hour = this.hour < 10 ? '0' + this.hour : this.hour;
    const minutes = date.getMinutes();
    this.minute = minutes < 10 ? '0' + minutes : minutes.toString();
    const seconds = date.getSeconds();
    this.second = seconds < 10 ? '0' + seconds : seconds.toString();
  }

  constructor(
    private restService: RestService,
    private auth: AuthService,
    private router: Router,
    private authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn();
  }

  logOut(event: boolean) {
    if (event) {
      this.auth.logout();
      this.isLoggedIn = false;
    }
  }
  data: {
    UsersCount: number,
    GroupCount: number,
    ReminderCount: number,
    EventCount: number,
  } = {
    UsersCount: 0,
    GroupCount: 0,
    ReminderCount: 0,
    EventCount: 0,
  }

}
interface LandingResult {
  success: boolean,
  code: number,
  message: string,

  usersCount: number,
  groupCount: number,
  reminderCount: number,
  eventCount: number,
}
