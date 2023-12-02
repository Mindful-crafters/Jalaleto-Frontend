import { RestService } from './../shared/services/Rest.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { Component, OnInit, ViewChild } from '@angular/core';
import { Shared } from '../shared/services/shared.service';
import { AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';


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
  profilePicture: File | undefined;
  selectedImage: string | undefined;

  constructor(
    private rest: RestService,
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

    this.restService.post("User/ProfileInfo", null).subscribe((res: ProfileResult) => {
      this.data.FirstName = res.firstName;
      this.data.LastName = res.lastName;
      this.data.UserName = res.userName;
      this.data.Email = res.email;
      this.data.Birthday = res.birthday;


    })
  }
  // private parseToken(token: string): any {
  //   const tokenParts = token.split('.');
  //   if (tokenParts.length === 3) {
  //     const decode = atob(tokenParts[1]);
  //     return JSON.parse(decode);
  //   }
  //   return null;
  // }
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
    this.restService.postWithoutHeader<any>('User/EditProfile', this.data).subscribe(
      (response) => {
        console.log(response);
        if (response['success']) {
          this.updateData();
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
  updateData(){
    this.data = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Birthday: null,
      Email: "",
      Image: ""
    }
    this.selectedImage = undefined;
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
