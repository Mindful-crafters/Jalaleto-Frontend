import { RestService } from './../shared/services/Rest.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {

  constructor(private formBuilder: FormBuilder, private restService: RestService) {

  }
  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ngOnInit(): void {
    this.NewPasswoedForm = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
      }
    )
  }

  GetCode() {
    const email = this.NewPasswoedForm.getRawValue();
    this.restService.postData<any>('User/SendRestPasswordEmail', email).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }

  NewPasswoedForm: FormGroup;


}
