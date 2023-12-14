import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../shared/services/Rest.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent {

  formGroup: FormGroup;
  group: Group = new Group();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private formBuilder: FormBuilder, private restService: RestService) {

  }
  ngOnInit(): void {
    this.CreateForm();
  }

  CreateForm() {
    this.formGroup = this.formBuilder.group(
      {
        name: [this.group?.name || null, Validators.required],
        description: [this.group?.description || null],
        emails: [null, Validators.required]
      }
    )

  }

  close() {
    this.dialogRef.close(null);
  }

  Submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    var newGroup: any = this.formGroup.getRawValue();
    newGroup.emails = this.emails;
    this.dialogRef.close(newGroup);

  }

  addOnBlur = true;
  emails: string[] = [];
  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  add(event: MatChipInputEvent): void {

    const value: string = (event.value || '').trim();

    if (!value.match(this.emailRegex) && value != '') {
      const customError = { customErrorKey: 'Custom error message for email' };
      setTimeout(() => {

        this.formGroup.get('emails').setErrors(customError);
        this.formGroup.get('emails').markAsTouched();
      }, 0)
      return;
    }

    if (value) {
      this.formGroup.get('emails').reset();
      this.emails.push(value);
    }
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }
}



class Group {
  name: string = '';
  description: string = '';
  emails: string[] = [];
}