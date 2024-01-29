import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../shared/services/Rest.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent {

  formGroup: FormGroup;
  group: Group = new Group();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  selectedImage: string | undefined;
  profilePicture: any | undefined;


  constructor(public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private formBuilder: FormBuilder, private restService: RestService,
    private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.CreateForm();
  }

  CreateForm() {
    this.formGroup = this.formBuilder.group(
      {
        name: [this.group?.name || null, Validators.required],
        description: [this.group?.description || null],
        invitedEmails: [null, Validators.required]
      }
    )

  }

  close() {
    this.dialogRef.close(false);
  }

  Submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    var newGroup: Group = this.formGroup.getRawValue();
    newGroup.members = this.invitedEmails;
    newGroup.imageFile = this.selectedImage;

    const formData = new FormData();
    formData.append('Image', this.profilePicture);
    formData.append('Description', newGroup.description);
    formData.append('Name', newGroup.name);

    newGroup.members.forEach(email => {
      formData.append("InvitedEmails", email)
    })
    this.isRequesting = true;
    this.restService.post('Group/Create', formData).subscribe((res) => {
      if (res['success']) {
        this.toastr.success('گروه با موفقیت ایجاد شد', 'موفقیت');
        this.dialogRef.close(true);
      }
      else {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }
      this.isRequesting = false;
    },
      (error: HttpErrorResponse) => {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');

      })

  }

  addOnBlur = true;
  invitedEmails: string[] = [];
  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isRequesting: boolean = false;

  add(event: MatChipInputEvent): void {

    const value: string = (event.value || '').trim();

    if (!value.match(this.emailRegex) && value != '') {
      const customError = { customErrorKey: 'Custom error message for email' };
      setTimeout(() => {

        this.formGroup.get('invitedEmails').setErrors(customError);
        this.formGroup.get('invitedEmails').markAsTouched();
      }, 0)
      return;
    }

    if (value) {
      this.formGroup.get('invitedEmails').reset();
      this.invitedEmails.push(value);
    }
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.invitedEmails.indexOf(email);

    if (index >= 0) {
      this.invitedEmails.splice(index, 1);
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedImage = URL.createObjectURL(file);
      this.profilePicture = file;
    }
  }
}

class Group {
  name: string = '';
  description: string = '';
  members: string[] = [];
  imageFile: any;
}