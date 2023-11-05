import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  isSignedClicked: boolean = false;
  @ViewChild('ngOtpInput') ngOtpInputRef: any;

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
}
