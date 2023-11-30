import { RestService } from './../shared/services/Rest.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { UserModel } from '../shared/types/UserModel.type';
import { Shared } from '../shared/services/shared.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { AuthService } from './../shared/services/auth.service';
import { AbstractControl, ValidationErrors, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  tokenData: {
    FirstName: string,
    LastName: string,
    UserName: string,
    Birthday: string,
    Email: string,
    Image: string

  } = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Birthday: "",
      Email: "",
      Image: ""
    }
  session: any;
  profilePicture: File | undefined;
  selectedImage: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private Router: Router,
    private rest: RestService,
    private shared: Shared,
    private restService: RestService,
  ) {}


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



  ngOnInit() {
    const token = '';

    //load data from local storage
    // this.tokenData = this.parseToken(token);
    // let data = localStorage.getItem('session')
    // this.session = JSON.parse(data);
  }
  private parseToken(token: string): any {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const decode = atob(tokenParts[1]);
      return JSON.parse(decode);
    }
    return null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {

      this.selectedImage = URL.createObjectURL(file);
      this.profilePicture = file;
    }
  }

  removePhoto() {
    this.selectedImage = undefined;
    this.profilePicture = undefined; 
  }


  onSubmit() {
    if (this.profilePicture) {
      const formData = new FormData();
      formData.append('profilePicture', this.profilePicture);
    }
  }
}

interface ProfileResult {
  token?: string,
  success: boolean,
  code: number,
  message: string,
}
