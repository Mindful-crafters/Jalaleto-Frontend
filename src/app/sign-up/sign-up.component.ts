import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxOtpInputConfig } from 'ngx-otp-input';

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
  isSignedClicked: boolean = false;
  signUpSuccus = false;
  signUpFail = false;
  formControl : FormControl;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{1,20}')]),
        username: [null, Validators.required],
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')])
      }
    )
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
    console.log(value);
  }

  handleFillEvent(value: string): void {
    console.log(value);
  }
  
  checkForm(){
    this.isSignedClicked = true;
  }

  verification(){
    let succus = false;
    this.isSignedClicked = false;
    //api

    if(!succus){
      this.signUpFail = true;
    }
    else{
      this.signUpSuccus = true;

      setTimeout(()=>{
        //navigate to login
      },2000)
    }
  }
}
