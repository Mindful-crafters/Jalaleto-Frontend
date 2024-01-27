import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-event',
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss']
})
export class PostEventComponent {
  formGroup: FormGroup;
  selectedImage: string | undefined;
  profilePicture: any | undefined;
  constructor(public dialogRef: MatDialogRef<PostEventComponent>,
    private formBuilder: FormBuilder, private restService: RestService,
    private toastr: ToastrService) {

  }
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedImage = URL.createObjectURL(file);
      this.profilePicture = file;
    }
  }
  close() {
    this.dialogRef.close(null);
  }
}
