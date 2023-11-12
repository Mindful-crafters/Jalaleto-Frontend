import { RestService } from './../shared/services/Rest.service';
import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  logInForm: FormGroup;
  constructor(
    private Router: Router,
    private formBuilder: FormBuilder,
    private restService: RestService
  ) {

  }
  ngOnInit(): void {
    this.logInForm = this.formBuilder.group(
      {
        username: [null, Validators.required],
        password: new FormControl('', [Validators.required])
      }
    )
  }

  login(info: { username: string, password: string }) {
    console.log(info)
    // console.log(this.logInForm.controls['password'].value)

    this.restService.postData<any>('User/Login', info).subscribe(
      (response) => {
        console.log(response);
        if (response['success']) {
          this.Router.navigate(['dashboard']);
        }
      }
    )

  }
  redirectforgetpassword() {
    this.Router.navigate(['newpassword']);
  }
}

interface LoginResult {
  token?: string,
  success: boolean,
  code: number,
  message: string,
}