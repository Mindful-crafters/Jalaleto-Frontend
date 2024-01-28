import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../shared/services/Rest.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.scss']
})
export class ShowPostComponent {
  constructor(public dialogRef: MatDialogRef<ShowPostComponent>,
    private formBuilder: FormBuilder, private restService: RestService,
    private toastr: ToastrService,
  ){
    
  }
  close() {
    this.dialogRef.close(null);
  }
}
