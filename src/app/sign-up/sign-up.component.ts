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

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(1000)), // Adjust the duration (1000ms = 1s)
    ]),
  ],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  code = '';
  hashString = '';
  isSignedClicked: boolean = false;
  signUpSuccus = false;
  signUpFail = false;
  formControl: FormControl;
  appearBtn = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private Router: Router,
    private rest: RestService,
    private shared: Shared
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        mail: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
        lastName: [null, Validators.required],
        firstName: [null, Validators.required],
        userName: [null, Validators.required, Validators.minLength(3)],
        password: [null, [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]],
        birthday: [null, [Validators.required, this.validateAge]]
      }
    )
  }

  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  Submit() {
    if (this.signUpForm.invalid || this.signUpForm.get('birthday').value == null || !this.IsValidBirthDay(this.signUpForm.get('birthday').value)) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const email = {
      "email": this.signUpForm.get('mail').value
    }


    this.rest.postData<any>('User/SendVerifyEmail', email).subscribe(
      (response) => {
        console.log(response);
        if (response['success']) {
          this.isSignedClicked = true
          this.shared.setHashString(response['hashString']);
          console.log(this.hashString);
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  IsValidBirthDay(BirthDay: Date): boolean {
    const currentDate = new Date();

    return currentDate >= BirthDay;
  }

  validateAge(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (selectedDate <= currentDate) {
      return null;
    } else {
      return { customError: true };
    }
  }

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  handeOtpChange(value: string[]): void {
    this.appearBtn = false;
    console.log(value);
  }

  handleFillEvent(value: string): void {
    console.log('fill', value);
    this.appearBtn = true;
    this.code = value;
  }

  verification() {
    const newPerson = this.signUpForm.getRawValue();
    newPerson.hashString = this.shared.getHashString;
    newPerson.code = this.code
    newPerson.birthday = this.datePipe.transform(newPerson.birthday, 'yyyy-MM-dd').toString();

    console.log(newPerson);

    this.rest.postData<SignUPPerson>('User/SignUp', newPerson).subscribe(
      (res) => {
        if (res['success']) {
          this.signUpSuccus = true;
          setTimeout(() => {
            this.Router.navigate(['login'])
          }, 1500)
        }
        else {
          this.signUpFail = true;

          setTimeout(() => {
            this.signUpFail = false;
          }, 1500)
        }
      },
      (error) => {
        this.signUpFail = true;
      }
    )
  }

  redirectToLogin() {
    this.Router.navigate(['login']);
  }

}

export class SignUPPerson {
  public mail: string;
  lastName: string;
  userName: string;
  firstName: string;
  password: string;
  birthday: string;
  hashString: string;
  code: number;

  constructor(person: any) {
    this.mail = person.mail || null;
    this.lastName = person.lastName || null;
    this.firstName = person.firstName || null;
    this.userName = person.userName || null;
    this.password = person.password || null;
    this.birthday = person.birthday || null;
  }
}