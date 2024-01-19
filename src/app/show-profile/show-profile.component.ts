import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestService } from './../shared/services/Rest.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { Shared } from '../shared/services/shared.service';
import { AbstractControl, ValidationErrors, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import {
  NzSkeletonAvatarShape,
  NzSkeletonAvatarSize,
  NzSkeletonButtonShape,
  NzSkeletonButtonSize,
  NzSkeletonInputSize
} from 'ng-zorro-antd/skeleton';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = ['ورزشی', 'گیم', 'طبیعت', 'اجتماعی', 'درسی'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);
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
  isLoading = true;

  data: {
    FirstName: string,
    LastName: string,
    UserName: string,
    Birthday: string,
    Email: string,
    image: File,
    imagePath: string,
    interests: string[]

  } = {
      FirstName: "",
      LastName: "",
      UserName: "",
      Birthday: "",
      Email: "",
      image: null,
      imagePath: "",
      interests: []
    }

  requestData = {
    FirstName: this.data.FirstName,
    LastName: this.data.LastName,
    UserName: this.data.UserName,
    Birthday: this.data.Birthday,
    image: this.data.image,
    interests: this.data.interests
  }
  session: any;
  profilePicture: File | undefined;
  @ViewChild('fileInput') fileInput: any;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  imageLink: string | null = null;
  constructor(
    private rest: RestService,
    private restService: RestService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private matDialog: MatDialog
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      console.log('value', value)
      console.log('list', this.fruits)
      if (this.allFruits.includes(value) && !this.fruits.includes(value)) {
        this.fruits.push(value);
        this.updateInterest();
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);

  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
      this.updateInterest();
    }
  }

  updateInterest() {
    const formData = new FormData;
    console.log(this.selectedFile);
    formData.append('FirstName', this.data.FirstName);
    formData.append('LastName', this.data.LastName);
    formData.append('UserName', this.data.UserName);
    formData.append('BirthDay', this.data.Birthday);
    formData.append('Image', this.data.imagePath);
    this.fruits.forEach((interest, index) => {
      formData.append(`interests[${index}]`, interest);
    });
    console.log('before', formData.getAll)

    this.restService.post<any>('User/EditProfile', formData).subscribe(
      (response) => {
        if (response['success']) {
          this.updateData();
          this.toastr.success('پروفایل با موفقیت تغییر یافت', 'موفقیت');
          console.log('after', formData.getAll)

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

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.fruits.includes(event.option.viewValue)) {
      this.fruits.push(event.option.viewValue);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);

      this.updateInterest();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.data.imagePath = URL.createObjectURL(this.selectedFile);
  }

  ngOnInit() {
    this.restService.post("User/ProfileInfo", null).subscribe((res: ProfileResult) => {
      this.data.FirstName = res.firstName;
      this.data.LastName = res.lastName;
      this.data.UserName = res.userName;
      this.data.Email = res.email;
      this.data.Birthday = res.birthday;
      this.data.imagePath = res.imagePath;
      this.data.interests = res.interests;
      this.fruits = this.data.interests;
      console.log('interests', this.data.interests)
      const parts = res.birthday.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
        const year = parseInt(parts[2], 10);

        const format = this.datePipe.transform(new Date(year, month, day), 'yyyy-MM-dd');
        this.data.Birthday = format;
      }

      this.isLoading = false;
    });
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
  CreateGroup() {

    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(EditProfileComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      data : this.fruits
    })
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
  interests: string[]
}

