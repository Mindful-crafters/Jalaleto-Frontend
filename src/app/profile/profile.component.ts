import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private dayArray = ['یکشنبه','دوشنبه','سه شنبه','چهارشبه','پنجشنبه','جمعه','شنبه'];
  // private dayArray = ['Sunday','Monday','Tuesday','Wednesday','Friday','Saturday'];
  private date = new Date();
  public hour: any;
  public minute: string;
  public second: string;
  public ampm: string;
  public day: string;
  constructor() { }
  ngOnInit() {
    setInterval(()=> {
      const date = new Date();
      this.updateDate(date);
    },1000)
    this.day = this.dayArray[this.date.getDay()];
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
