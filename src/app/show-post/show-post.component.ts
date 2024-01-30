import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../timeline/add-event-dialog/add-event-dialog.component';
@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.scss']
})
export class ShowPostComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowPostComponent>,
    @Inject(MAT_DIALOG_DATA) public reviews: Review[],
    private postDialogRef: MatDialogRef<ShowPostComponent>,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder, private restService: RestService,
    private toastr: ToastrService,
  ){
    
  }
  close() {
    this.dialogRef.close(null);
  }
}
