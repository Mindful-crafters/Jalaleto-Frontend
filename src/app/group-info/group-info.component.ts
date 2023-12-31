import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { RestService } from '../shared/services/Rest.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { Shared } from '../shared/services/shared.service';
import { AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent {
  members: Member[] = [];
  selectedGroup: File | null = null;
  selectedMember: File | null = null;
  data: {
    GroupName: string;
    GroupImagePath: string;
    MemberName: string;
    MemberImagePath: string;
  } = {
    GroupName: "",
    GroupImagePath: "",
    MemberName: "",
    MemberImagePath: "",

  }
  onFileSelected(event: any) {
    this.selectedGroup = event.target.files[0] as File;
    this.selectedMember = event.target.files[0] as File;
    this.data.GroupImagePath = URL.createObjectURL(this.selectedGroup);
    this.data.MemberImagePath = URL.createObjectURL(this.selectedMember);
  }
  constructor(
    private rest: RestService,
    private restService: RestService,
    private http: HttpClient,
    private datePipe : DatePipe,
    private toastr:ToastrService
  ) {}
  ngOnInit() {

    this.restService.post("User/ProfileInfo", null).subscribe((res: GroupInfoResult) => {
      this.data.GroupName = res.name;
      this.data.GroupImagePath = res.imageUrl;
      this.members = res.members;
      // this.data.MemberName = res.membername;
      // this.data.MemberImagePath = res.memberimage;
    });
    

  }
}
class Member {
  name: string = '';
  imageUrl: string = '';
  imageFile: File = null;
}
interface GroupInfoResult {
  success: boolean,
  code: number,
  message: string,

  name: string,
  imageUrl: string,
  members: Member[];
  // membername: string,
  // memberimage: string,
  
}
