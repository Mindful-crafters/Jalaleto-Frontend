import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Shared } from '../shared/services/shared.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  ForgetPasswordform: FormGroup;

  constructor(private formBuilder: FormBuilder,private shared : Shared) {

  }

  ngOnInit(): void {
    this.ForgetPasswordform = this.formBuilder.group(
      {
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]),
        code: [null, Validators.required]
      }
    )
  }


  resetPassword(){
    const body = {
      "mail":this.shared.getEmail,
      "code": this.ForgetPasswordform.get('code').value,
      "newPassword": this.ForgetPasswordform.get('password').value,
      "hashString": this.shared.getHashStringEmail
    }

    console.log(body)
  }
}
