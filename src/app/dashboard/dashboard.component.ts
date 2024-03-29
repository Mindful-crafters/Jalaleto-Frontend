import { AuthService } from './../shared/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../shared/services/Rest.service';
import * as moment from 'jalali-moment';
import { Group } from '../shared/types/Group';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzSkeletonAvatarShape, NzSkeletonAvatarSize, NzSkeletonButtonShape, NzSkeletonButtonSize, NzSkeletonInputSize } from 'ng-zorro-antd/skeleton';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  buttonActive = true;
  avatarActive = true;
  inputActive = true;
  imageActive = true;
  buttonSize: NzSkeletonButtonSize = 'default';
  avatarSize: NzSkeletonAvatarSize = 'default';
  inputSize: NzSkeletonInputSize = 'default';
  elementActive = true;
  buttonShape: NzSkeletonButtonShape = 'default';
  avatarShape: NzSkeletonAvatarShape = 'circle';
  elementSize: NzSkeletonInputSize = 'default';
  isLoadingGroup = true;
  hours: string | number = '00';
  minutes: string | number = '00';
  seconds: string | number = '00';

  isLoggedIn = false;
  popularGroups: Group[];
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
  formattedDate: string;

  constructor(
    private restService: RestService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {
    this.isLoadingGroup =true;
    this.isLoggedIn = authService.isLoggedIn();
    console.log(this.authService.getToken())
    this.loadPopularGroups(3)
    const currentDate = new Date();

    // Map English month names to Persian
    const persianMonthMap = {
      January: 'ژانویه',
      February: 'فوریه',
      March: 'مارس',
      April: 'آوریل',
      May: 'مه',
      June: 'ژوئن',
      July: 'ژوئیه',
      August: 'اوت',
      September: 'سپتامبر',
      October: 'اکتبر',
      November: 'نوامبر',
      December: 'دسامبر',
    };

    // Get month names
    const englishMonth = currentDate.toLocaleString('en-US', { month: 'long' });
    const persianMonth = persianMonthMap[englishMonth];

    // Format the date in the desired Persian way
    const formattedJalaliDate = `${currentDate.getDate()} ${persianMonth} ${currentDate.getFullYear()}`;
    const formattedGregorianDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.formattedDate = `${formattedJalaliDate}`;
  }

  ngOnInit() {
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000)

    this.day = this.dayArray[this.date.getDay()];
    this.jalaliMonth = moment().locale('fa').format('jMMMM');
    const jalali = moment().locale('fa');
    this.jalaliYear = jalali.jYear();
    this.jalaliDay = jalali.date();
    this.updateTime()
    this.restService.post("User/LandingInfo", null).subscribe((res: LandingResult) => {
      this.data.UsersCount = res.usersCount;
      this.data.GroupCount = res.groupCount;
      this.data.EventCount = res.eventCount;
      this.data.ReminderCount = res.reminderCount;
    });
  }

  private updateTime(): void {
    const date = new Date();
    this.hours = this.formatTime(date.getHours());
    this.minutes = this.formatTime(date.getMinutes());
    this.seconds = this.formatTime(date.getSeconds());

    setTimeout(() => this.updateTime(), 1000);
  }

  private formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  loadPopularGroups(num: number) {
    const apiUrl = 'https://dev.jalaleto.ir/api/Group/PopularGroups';
    const url = `${apiUrl}?cnt=${num}`;

    this.http.post(url, {}).subscribe(
      (data) => {
        console.log('Received data:', data);
        this.popularGroups = data['data'];
        console.log(this.popularGroups);
        // Process the data as needed
        this.isLoadingGroup = false;
      },
      (error) => {
        console.error('Error posting data:', error);
      }
    );
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
