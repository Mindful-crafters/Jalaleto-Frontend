import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient) {

  }
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        mail: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
        lastName: [null, Validators.required],
        firstName: [null, Validators.required],
        userName: [null, Validators.required, Validators.minLength(3)],
        password: [null, [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]],
        birthday: [null, [Validators.required, this.validateAge]]
      }
    )
  }

  signUpForm: FormGroup;

  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  Submit() {
    if (this.signUpForm.invalid || this.signUpForm.get('birthday').value == null || !this.IsValidBirthDay(this.signUpForm.get('birthday').value)) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const newPerson = this.signUpForm.getRawValue();
    newPerson.birthday = this.datePipe.transform(newPerson.birthday, 'yyyy-MM-dd').toString();

    this.http.post<any>('https://localhost:7117/api/User/SignUP', newPerson).subscribe(
      (response) => {
        console.log(response);
      }
    )


  }



  IsValidBirthDay(BirthDay: Date): boolean {
    // Validate that the user is at least 18 years old
    const currentDate = new Date();

    return currentDate >= BirthDay;
  }
  validateAge(control: AbstractControl): ValidationErrors | null {
    // Validate that the user is at least 18 years old
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (selectedDate <= currentDate) {
      return null; // Valid age
    } else {
      return { customError: true }; // Invalid age
    }
  }

}

export class SignUPPerson {
  mail: string;
  lastName: string;
  userName: string;
  firstName: string;
  password: string;
  birthday: string;

  constructor(person: any) {
    this.mail = person.mail || null;
    this.lastName = person.lastName || null;
    this.firstName = person.firstName || null;
    this.userName = person.userName || null;
    this.password = person.password || null;
    this.birthday = person.birthday || null;
  }

}
