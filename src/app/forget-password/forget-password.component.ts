import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Shared } from '../shared/services/shared.service';
import { RestService } from '../shared/services/Rest.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  ForgetPasswordform: FormGroup;
  error = false;

  constructor(
    private rest: RestService,
    private formBuilder: FormBuilder,
    private shared: Shared,
    private router: Router,
    private toastr: ToastrService
    ) {

  }


  ngOnInit(): void {
    this.ForgetPasswordform = this.formBuilder.group(
      {
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]),
        code: [null, Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator.bind(this)
      }
    );

    this.ForgetPasswordform.get('confirmPassword').valueChanges.subscribe(() => {
      this.ForgetPasswordform.updateValueAndValidity();
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    const isMismatch = confirmPassword !== '' && password !== confirmPassword;

    const control = formGroup.get('confirmPassword');
    if (isMismatch) {
      control.setErrors({ passwordMismatch: true });
    } else {
      control.setErrors(null);
    }

    return isMismatch ? { passwordMismatch: true } : null;
  }


  resetPassword() {
    const body = {
      "mail": this.shared.getEmail,
      "code": this.ForgetPasswordform.get('code').value,
      "newPassword": this.ForgetPasswordform.get('password').value,
      "hashString": this.shared.getHashStringEmail
    }

    if(body.mail == null){
      this.router.navigate(['newpassword']);
      this.toastr.error('دوباره ایمیل خود را وارد کنید', 'خطا');
    }

    const password = this.ForgetPasswordform.get('password').value;
    const confirmPassword = this.ForgetPasswordform.get('confirmPassword').value;

    if(password != confirmPassword ){
      this.toastr.error('رمز عبور و تایید رمز عبور همخوانی ندارند.', 'خطا');
      return;
    }

    this.rest.postWithoutHeader<any>('User/ResetPassword', body).subscribe(
      (response) => {
        console.log(response)
        if (response['success']) {
          this.router.navigate(['login']);
          this.toastr.success('تغییر رمز عبور با موفقیت انجام شد.', 'خطا');
        }
        else if(response['message']=='Incorect verification code') {
          this.toastr.error('کد وارد شده صحیح نمی باشد.', 'خطا');
        }
      },
      (error) => {
        this.toastr.error('مشکلی به وجود آمده است.', 'خطا');
      }
    )
  }
}
