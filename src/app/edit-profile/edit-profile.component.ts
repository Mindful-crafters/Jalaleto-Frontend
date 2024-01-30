import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../shared/services/Rest.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpErrorResponse } from '@angular/common/http';
import { ShowGroupsComponent } from '../show-groups/show-groups.component';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'jalali-moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  close() {
    this.dialogRef.close(null);
  }
  constructor(public dialogRef: MatDialogRef<ShowGroupsComponent>,
    private formBuilder: FormBuilder, private restService: RestService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public fruits: any) {
    console.log(fruits)
  }
  data: {
    FirstName: string,
    LastName: string,
    UserName: string,
    Birthday: string,
    Email: string,
    image: File,
    imagePath: string,
    interests : string[]
  } = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Birthday: "",
      Email: "",
      image: null,
      imagePath: "",
    interests : []
    }
  requestData = {
    FirstName: this.data.FirstName,
    LastName: this.data.LastName,
    UserName: this.data.UserName,
    Birthday: this.data.Birthday,
    image: this.data.image,
    interests : this.data.interests
  }
  session: any;
  profilePicture: File | undefined;
  @ViewChild('fileInput') fileInput: any;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  old: File | null = null;
  imageLink: SafeResourceUrl | null = null;

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
  onFileSelected(event: any) {
    console.log('aaa',event.target.files)
      this.selectedFile = event.target.files[0] as File;
      this.data.imagePath = URL.createObjectURL(this.selectedFile);
  }
  

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0] as File;
  //   this.data.imagePath = URL.createObjectURL(this.selectedFile);
  // }
  // onFileSelected(event: any) {
  //   if (event.target.files.length > 0) {
  //     // اگر یک فایل انتخاب شده باشد
  //     this.selectedFile = event.target.files[0] as File;
  //     this.data.imagePath = URL.createObjectURL(this.selectedFile);
  //   }
  // }
  ngOnInit() {
    this.restService.post("User/ProfileInfo", null).subscribe((res: ProfileResult) => {

      this.data.FirstName = res.firstName;
      this.data.LastName = res.lastName;
      this.data.UserName = res.userName;
      this.data.Email = res.email;
      this.data.Birthday = res.birthday;
      this.data.imagePath = res.imagePath;
      this.imageLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.imagePath) as SafeResourceUrl;
      
      console.log('img',this.data.imagePath);
      this.data.interests = res.interests;
      const parts = res.birthday.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
        const year = parseInt(parts[2], 10);

        const format = this.datePipe.transform(new Date(year, month, day), 'yyyy-MM-dd');
        this.data.Birthday = format;
      }
      

    });
  }
  submit() {
    this.data.Birthday = this.datePipe.transform(this.data.Birthday, 'yyyy-MM-dd').toString();
    console.log('iiii',this.data.imagePath);
    console.log('sss',this.imageLink);
    console.log('image',this.selectedFile);
    
    // if (this.data.Password === '' || this.data.Password === null) {
    //   this.data.Password = null;
    //   console.log('pppp',this.data.Password);
    // }
    const formData = new FormData;
    formData.append('FirstName', this.data.FirstName);
    formData.append('LastName', this.data.LastName);
    formData.append('UserName', this.data.UserName);
    formData.append('BirthDay', this.data.Birthday);
    
    if(this.selectedFile!=null){
      formData.append('Image', this.selectedFile);
    }
    else
    {
      const imageUrl: string = this.imageLink.toString();
      formData.append('Image',imageUrl);
      console.log('goz',imageUrl);
    }
    console.log(formData)
    this.fruits.forEach((interest, index) => {
      formData.append(`interests[${index}]`, interest);
    });
    
    this.restService.post<any>('User/EditProfile', formData).subscribe(
      (response) => {
        if (response['success']) {
          this.updateData();
          this.toastr.success('پروفایل با موفقیت تغییر یافت', 'موفقیت');
        }
        else {
          if (response['message'] = 'User already exists.')
            this.toastr.error('نام کاربری قبلا در سبستم ثبت شده است.', 'خطا');
          else {
            this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
          }
        }
      },
    )
  }
  
// Convert data URI to Blob
dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
  updateData() {
    this.requestData = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Birthday: null,
      image: null,
      interests: []
    }
    this.selectedImage = undefined;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.profilePicture) {
      const formData = new FormData();
      formData.append('profilePicture', this.profilePicture);
    }
  }
}
interface ProfileResult {
  success: boolean,
  code: number,
  message: string,

  firstName: string,
  lastName: string,
  userName: string,
  birthday: string,
  email: string,
  imagePath: string,
  interests : string[]
}

