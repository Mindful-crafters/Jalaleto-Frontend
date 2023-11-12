import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  constructor(private formBuilder: FormBuilder) {

  }
  ngOnInit(): void {
    this.ForgetPasswordform = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{1,20}')]),
        username: [null, Validators.required],
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]),
        code: [null, Validators.required]
      }
    )
  }

  ForgetPasswordform: FormGroup;


}
