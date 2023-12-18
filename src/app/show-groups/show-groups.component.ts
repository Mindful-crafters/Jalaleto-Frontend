import { Component, OnInit } from '@angular/core';
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

  constructor(private matDialog: MatDialog, private restService: RestService) {

  }

  ngOnInit(): void {
    this.restService.post('Group/Info', null).subscribe((res) => {
      this.groups = res['data'];
      console.log(this.groups);
    })
  }
  groups: Group[] = [];

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
