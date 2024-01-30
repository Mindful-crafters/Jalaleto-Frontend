import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, resolveForwardRef } from '@angular/core';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { RestService } from '../shared/services/Rest.service';
import { UserModel } from '../shared/types/UserModel.type';
import { Shared } from '../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

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
  isloading = false;
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
    private toastr: ToastrService,
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

    this.isloading = true;
    this.rest.postWithoutHeader<any>('User/SendVerifyEmail', email).subscribe(
      (response) => {
        this.isloading = false;
        if (response['success']) {
          this.isSignedClicked = true
          this.toastr.success('کد تایید به ایمیل فرستاده شد.', 'موفقیت');
          this.shared.setHashString(response['hashString']);
        }
        else if (response['message'] == 'Mail already in use.') {
          this.isloading = false;
          this.toastr.error('ایمیل تکراری است.', 'خطا');
        }
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('مشکلی به وجود آمده است.', 'خطا');
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

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);

    if (selectedDate <= currentDate && selectedDate >= minDate) {
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
  }

  handleFillEvent(value: string): void {
    this.appearBtn = true;
    this.code = value;
  }

  verification() {
    const newPerson = this.signUpForm.getRawValue();
    newPerson.hashString = this.shared.getHashString;
    newPerson.code = this.code
    newPerson.birthday = this.datePipe.transform(newPerson.birthday, 'yyyy-MM-dd').toString();

    this.rest.postWithoutHeader<SignUPPerson>('User/SignUp', newPerson).subscribe(
      (res) => {
        console.log(res);
        if (res['success']) {
          this.toastr.success('حساب کاری با موفقیت ساخته شد.', 'موفقیت');
          
          setTimeout(() => {
            this.Router.navigate(['login'])
          }, 1500)

        }
        else if(res['message']=='Incorect verification code'){
          this.toastr.error('کد وارد شده صحیح نمی باشد.', 'خطا');
        }
        else {
          this.toastr.error('مشکلی رخ داده است', 'خطا');

          setTimeout(() => {
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