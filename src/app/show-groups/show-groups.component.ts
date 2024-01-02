import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'jalali-moment';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { RestService } from '../shared/services/Rest.service';

@Component({
  selector: 'app-show-groups',
  templateUrl: './show-groups.component.html',
  styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {
  constructor(
    private matDialog: MatDialog,
    private restService: RestService,
    private renderer: Renderer2) {
  }

  ngOnInit(): void {
    // this.restService.post('Group/Info', null).subscribe((res) => {
    //   this.groups = res['data'];
    //   console.log(this.groups);
    // })
  }
  groups: Group[] = [
    {
      name: 'amir',
      description: 'adkjal',
      imageUrl: '',
      members: [],
      imageFile: null
    },
    {
      name: 'reza',
      description: 'chera',
      imageUrl: '',
      members: [],
      imageFile: null
    },
    {
      name: 'hosein',
      description: 'asrooneh',
      imageUrl: '',
      members: [],
      imageFile: null
    }, {
      name: 'mohammad',
      description: 'asrooneh',
      imageUrl: '',
      members: [],
      imageFile: null
    }, {
      name: 'ali',
      description: 'asrooneh',
      imageUrl: '',
      members: [],
      imageFile: null
    }, {
      name: 'haji',
      description: 'asrooneh',
      imageUrl: '',
      members: [],
      imageFile: null
    }
  ];

  CreateGroup() {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(CreateGroupDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res)
        this.groups.push(res);
      console.log(res);

    })
  }
}

class Group {
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  members: string[];
  imageFile: File = null;
}
