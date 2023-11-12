import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  
  constructor(private formBuilder:FormBuilder)
  {

  }
  ngOnInit(): void {
    this.NewPasswoedForm = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{1,20}')]),
        username:[null, Validators.required],
        password : new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')])
      }
    )
  }

  NewPasswoedForm:FormGroup;


}
