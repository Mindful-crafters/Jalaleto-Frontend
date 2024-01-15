import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'jalali-moment';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { RestService } from '../shared/services/Rest.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-show-groups',
  templateUrl: './show-groups.component.html',
  styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {

  @Output() showGroup: EventEmitter<Group> = new EventEmitter<Group>();

  constructor(private matDialog: MatDialog, private restService: RestService) {

  }

  ngOnInit(): void {

    this.SearchInputChangeHandler();
    this.restService.post('Group/Groups?FilterMyGroups=false', null).subscribe((res) => {
      console.log(res);
      this.allGroups = res['data'];
    })

    this.restService.post('Group/Groups?FilterMyGroups=true', null).subscribe((res) => {
      console.log(res);
      this.myGroups = res['data'];
    })
  }
  allGroups: Group[] = [];
  myGroups: Group[] = [];
  filterdGroups: Group[] = [];
  isSearching: boolean = false;
  searchString: string;
  searchInputChanges = new Subject<string>();

  CreateGroup() {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(CreateGroupDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((res) => {
      //if (res)
      //   this.groups.push(res);
      // console.log(res);

    })
  }

  OpenGroup(group: Group) {
    this.showGroup.emit(group);
  }

  SearchInputChangeHandler() {
    this.searchInputChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.Search(value);
      })
  }

  Search(groupName: string) {
    this.restService.post('Group/Search?GroupName=' + groupName, null).subscribe((res) => {
      console.log(res);
      this.filterdGroups = res['data'];
    })

  }
}

export class Group {
  groupId: number = 0;
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  imageFile: File = null;
  members: Member[]
}

export class Member {
  mail: string = '';
  firstName: string = ''
  userName: string = '';
  image: string = '';
}
