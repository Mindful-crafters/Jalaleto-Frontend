import { Posts } from '../shared/types/Group';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-event',
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss']
})
export class PostEventComponent {
  // formGroup: FormGroup;
  selectedImage: string | undefined;
  profilePicture: any | undefined;
  selectedStarCount: number = 0;
  public form: FormGroup;
  public rating3: number;
  // data: {
  //   Text: string;
  //   Score: number;
  // } = {
  //   Text : "",
  //   Score: 0,
  // }
  constructor(public dialogRef: MatDialogRef<PostEventComponent>,
    private formBuilder: FormBuilder, private restService: RestService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public eventId,
    private fb: FormBuilder) {
    this.rating3 = 0;
    this.form = this.fb.group({
      text: ['', Validators.required],
      rating: [0, Validators.required],

    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedImage = URL.createObjectURL(file);
      this.profilePicture = file;
    }
  }
  onStarClicked(event: any): void {
    this.selectedStarCount = event.selectedCount;
    console.log(this.selectedStarCount);
  }

  close() {
    this.dialogRef.close(null);
  }

  submit() {
    console.log('data', this.eventId);
    if (this.eventId) {
      const eventData = {
        text: this.form.value.text,
        score: this.form.value.rating,
        eventId: this.eventId,
      };
      console.log('eventId:', this.eventId);
      console.log('Text:', this.form.value.text);
      console.log('Score:', this.form.value.rating);
      this.restService.post<any>('Event/AddEventReview', eventData).subscribe(
        (response) => {
          if (response['success']) {
            this.toastr.success('نظر شما با موفقیت ثبت شد.', 'موفقیت');
            this.dialogRef.close(true);
          }
          else {
            this.toastr.error('نظر شما ثبت نشد', 'خطا')
          }
        },
        (error) => {
          this.toastr.error('مشکلی به وجود آمده است.', 'خطا');
        }
      )
    }
  }
}

