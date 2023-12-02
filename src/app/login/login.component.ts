import { RestService } from './../shared/services/Rest.service';
import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Shared } from '../shared/services/shared.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error = false;
  logInForm: FormGroup;
  constructor(
    private Router: Router,
    private formBuilder: FormBuilder,
    private restService: RestService,
    private auth: AuthService,
    private shared: Shared
  ) { }

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group(
      {
        username: [null, Validators.required],
        password: new FormControl('', [Validators.required])
      }
    )
  }

  login(info: { username: string, password: string }) {
    this.restService.postWithoutHeader<any>('User/Login', info).subscribe(
      (response) => {
        console.log(response);
        if (response['success']) {
          this.auth.setToken(response['token']);
          this.Router.navigate(['dashboard']);
        }
        else {
          this.error = true;
        }
      },
      (error) => {
        this.error = true;
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