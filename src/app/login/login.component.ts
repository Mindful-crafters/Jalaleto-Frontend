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
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    
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
    this.http.post('', info).subscribe((res: LoginResult) => {
      if (res.success) {
        this.authService.setToken(res.token);
      } else {

      }
    });

  }
  redirectforgetpassword()
  {
    this.Router.navigate( ['forgetpassword'] );
  }
}

interface LoginResult {
  token?: string,
  success: boolean,
  code: number,
  message: string,
}