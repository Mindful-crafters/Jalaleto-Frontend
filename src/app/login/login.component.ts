import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  logInForm: FormGroup;
  constructor(private http: HttpClient,private formBuilder:FormBuilder) {
    
  }
  ngOnInit(): void {
    this.logInForm = this.formBuilder.group(
      {
        username: [null, Validators.required],
        password: new FormControl('', [Validators.required])

      }

    )

  }
  login(info: {username: string, password: string}) {
    console.log(info)
    // console.log(this.logInForm.controls['password'].value)
    this.http.post('',info)
  }
}
