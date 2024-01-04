import { AuthService } from './../shared/services/auth.service';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../shared/services/Rest.service';
import * as moment from 'jalali-moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { Group } from '../shared/types/Group';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  hours: string | number = '00';
  minutes: string | number = '00';
  seconds: string | number = '00';

  isLoggedIn = false;
  popularGroups : Group[];
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
    private router: Router,
    private authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn();
    console.log(this.authService.getToken())

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
    this.loadPopularGroups(10)
    this.updateTime()
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

  loadPopularGroups(num : number){
    this.restService.postWithoutHeader<any>('Group/PopularGroups', num).subscribe(
      (response) => {
        console.log(response)
        this.popularGroups = response['data']
        console.log(this.popularGroups)
      },
      (error) => {
        console.log('error')
      }
    )
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
}
