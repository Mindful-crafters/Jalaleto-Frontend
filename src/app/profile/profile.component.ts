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
  data: {
    FirstName: string,
    LastName: string,
    UserName: string,
    Birthday: Date,
    Email: string,
    Image: string

  } = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Birthday: null,
      Email: "",
      Image: ""
    }
  session: any;
  // dynamicLabel: string = 'نام';
  // change()
  // {
  //   this.dynamicLabel = 'احمد';
  // }
  ProfileForm: FormGroup;
  profilePicture: File | undefined; // New property for profile picture
  selectedImage: string | undefined;
  isSignedClicked: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private Router: Router,
    private rest: RestService,
    private shared: Shared,
    private restService: RestService,
  ) {

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
    const token = '';

    //load data from local storage
    // this.tokenData = this.parseToken(token);
    // let data = localStorage.getItem('session')
    // this.session = JSON.parse(data);
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000)
    this.day = this.dayArray[this.date.getDay()];
    this.restService.post("User/ProfileInfo", null).subscribe((res: ProfileResult) => {
      this.data.FirstName = res.firstName;
      this.data.LastName = res.lastName;
      this.data.UserName = res.userName;
      this.data.Email = res.email;
      this.data.Birthday = res.birthday;


    })
  }
  private parseToken(token: string): any {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const decode = atob(tokenParts[1]);
      return JSON.parse(decode);
    }
    return null;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Assuming 'URL.createObjectURL' generates a temporary URL for the selected image
      this.selectedImage = URL.createObjectURL(file);
      this.profilePicture = file; // Assign the selected file to profilePicture for upload
    }
  }

  removePhoto() {
    this.selectedImage = undefined;
    this.profilePicture = undefined;
  }

  submit()
  {
    this.rest.postWithoutHeader<any>('User/EditProfile', null).subscribe(
      (response) => {
        console.log(response);
        if (response['success']) {
          this.isSignedClicked = true
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
  onSubmit() {
    if (this.profilePicture) {
      const formData = new FormData();
      formData.append('profilePicture', this.profilePicture);

      // Example: Make an API call to upload the profile picture
      // this.http.post<ProfileResult>('YOUR_UPLOAD_URL', formData).subscribe(response => {
      //   // Handle the response if needed
      // });
    }

    // Other form submission logic
    // ...
  }

  // ... Remaining component code ...
}

interface ProfileResult {
  success: boolean,
  code: number,
  message: string,

  firstName: string,
  lastName: string,
  userName: string,
  birthday: Date,
  email: string,
  // "image": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
}
