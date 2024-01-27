import { RestService } from './../shared/services/Rest.service';
import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Shared } from '../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
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
          console.log(this.auth.getToken())
          this.Router.navigate(['dashboard']);
        }
        else if(response['message']=='User not found') {
          this.toastr.error('کاربری یافت نشد.', 'خطا');
        }
        else if(response['message']=='Password is incorrect.'){
          this.toastr.error('رمز وارد شده اشتباه است.', 'خطا');
        }
      },
      (error) => {
        this.toastr.error('مشکلی به وجود آمده است.', 'خطا');
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