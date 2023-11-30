import { Injectable } from '@angular/core';
@Injectable()
export class persiancalendarservice {
  weekdaynames: string[] = ["شنبه", "یکشنبه", "دوشنبه",
    "سه شنبه", "چهارشنبه",
    "پنج شنبه", "جمعه"];
    
  monthnames: string[] = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"];

  strweekday: string = null;
  strmonth: string = null;
  day: number = null;
  month: number = null;
  year: number = null;
  ld: number = null;
  farsidate: string = null;

  today: Date = new Date();

  gregorianyear = null;
  gregorianmonth = null;
  gregoriandate = null;
  weekday = null;
  buf1: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  buf2: number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

  constructor() {
  }

  persiancalendar(gregoriandate): string {
    this.today = gregoriandate;
    this.gregorianyear = this.today.getFullYear();
    this.gregorianmonth = this.today.getMonth() + 1;
    this.gregoriandate = this.today.getDate();
    this.weekday = this.today.getDay();

    console.log('gregorian month : ',this.gregorianmonth)
    this.topersian(gregoriandate);
    return this.strweekday + " " + this.day + " " + this.strmonth + " " + this.year;
  }

  public returnPeaceOfDate(gregoriandate: Date, name: string): number {
    this.today = gregoriandate;
    this.gregorianyear = this.today.getFullYear();
    this.gregorianmonth = this.today.getMonth() + 1;
    this.gregoriandate = this.today.getDate();
    this.weekday = this.today.getDay();
    this.topersian(gregoriandate);

    if (name == 'day') {
      return this.day;
    } else if (name == 'month') {
      // console.log(this.month)
      return this.month;
    } else if (name == 'year') {
      return this.year;
    }

    return 0;
  }

  returnMonth(gregoriandate: Date) {
    this.today = gregoriandate;
    this.gregorianyear = this.today.getFullYear();
    this.gregorianmonth = this.today.getMonth() + 1;
    this.gregoriandate = this.today.getDate();
    this.weekday = this.today.getDay();
    this.topersian(gregoriandate);

    return this.strmonth;
  }

  topersian(gregoriandate) {
    if ((this.gregorianyear % 4) != 0)
      this.farsidate = this.func1();
    else
      this.farsidate = this.func2();
    this.strmonth = this.monthnames[Math.floor(this.month - 1)];
    this.strweekday = this.weekdaynames[this.weekday + 1];
  }


  func1(): string {
    this.day = this.buf1[this.gregorianmonth - 1] + this.gregoriandate;
    if (this.day > 79) {
      this.day = this.day - 79;
      if (this.day <= 186) {
        var day2 = this.day;
        this.month = (day2 / 31) + 1;
        this.day = (day2 % 31);
        if (day2 % 31 == 0) {
          this.month--;
          this.day = 31;
        }
        this.year = this.gregorianyear - 621;
      }
      else {
        var day2 = this.day - 186;
        this.month = (day2 / 30) + 7;
        this.day = (day2 % 30);
        if (day2 % 30 == 0) {
          this.month = (day2 / 30) + 6;
          this.day = 30;
        }
        this.year = this.gregorianyear - 621;
      }
    }
    else {
      this.ld = this.gregorianyear > 1996 && this.gregorianyear % 4 == 1 ? 11 : 10;
      var day2 = this.day + this.ld;
      this.month = (day2 / 30) + 10;
      this.day = (day2 % 30);
      if (day2 % 30 == 0) {
        this.month--;
        this.day = 30;
      }
      this.year = this.gregorianyear - 622;
    }
    var fulldate = this.day + "/" + Math.floor(this.month) + "/" + this.year;
    return fulldate
  }

  func2(): string {
    //console.log("entered func2");
    this.day = this.buf2[this.gregorianmonth - 1] + this.gregoriandate;
    this.ld = this.gregorianyear >= 1996 ? 79 : 80;
    if (this.day > this.ld) {
      this.day = this.day - this.ld;
      if (this.day <= 186) {
        var day2 = this.day;
        this.month = (day2 / 31) + 1;
        this.day = (day2 % 31);
        if (day2 % 31 == 0) {
          this.month--;
          this.day = 31;
        }
        this.year = this.gregorianyear - 621;
      }
      else {
        var day2 = this.day - 186;
        this.month = (day2 / 30) + 7;
        this.day = (day2 % 30);
        if (day2 % 30 == 0) {
          this.month--;
          this.day = 30;
        }
        this.year = this.gregorianyear - 621;
      }
      var fulldate = this.day + "/" + Math.floor(this.month) + "/" + this.year;
      return fulldate
    }
    else {
      var day2 = this.day + 10;
      this.month = (day2 / 30) + 10;
      this.day = (day2 % 30);
      if (day2 % 30 == 0) {
        this.month--;
        this.day = 30;
      }
      this.year = this.gregorianyear - 622;

      var fulldate = this.day + "/" + Math.floor(this.month) + "/" + this.year;
      return fulldate
    }
  }
}