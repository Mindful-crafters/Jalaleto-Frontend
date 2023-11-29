import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { RestService } from '../shared/services/Rest.service';
import { UserModel } from '../shared/types/UserModel.type';
import { Shared } from '../shared/services/shared.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  ProfileForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private Router: Router,
    private rest: RestService,
    private shared: Shared
  ) { 
    this.ProfileForm = this.formBuilder.group({
        mail: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
        lastName: [null, Validators.required],
        firstName: [null, Validators.required],
        userName: [null, Validators.required, Validators.minLength(3)],
        birthday: [null, [Validators.required, this.validateAge]]
    })
  }
  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  validateAge(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (selectedDate <= currentDate) {
      return null;
    } else {
      return { customError: true };
    }
  }
  private dayArray = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  private date = new Date();
  public hour: any;
  public minute: string;
  public second: string;
  public ampm: string;
  public day: string;
  ngOnInit() {
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000)
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
