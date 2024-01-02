import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { RestService } from '../shared/services/Rest.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { Shared } from '../shared/services/shared.service';
import { AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Group } from '../show-groups/show-groups.component';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent {
  constructor(
    private rest: RestService,
    private restService: RestService,
    private http: HttpClient,
    private datePipe : DatePipe,
    private toastr:ToastrService,
    private dialogRef:DialogRef,
    @Inject(MAT_DIALOG_DATA) public data: Group
  ) {}
  ngOnInit() {
    
  }

  close() {
    this.dialogRef.close(null);
  }
}
