import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
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
}
