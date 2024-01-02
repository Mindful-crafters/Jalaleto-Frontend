import { Component } from '@angular/core';
import { Group } from '../show-groups/show-groups.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupInfoComponent } from '../group-info/group-info.component';
import { RestService } from '../shared/services/Rest.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent {

  selectedGroup: Group = null;
  messages: Message[] = [
    { message: 'سلام', sender: new User({ name: 'امیر', image: '../../assets/a.png' }) },
    { message: 'سلام بر شما', sender: null },
    { message: 'سلام خوبی؟', sender: new User({ name: 'پارسا', image: 'assets/b.png' }) },
    { message: 'رویداد چه ساعتی است؟', sender: new User({ name: 'پارسا', image: 'assets/c.jpg' }) },
  ]

  sendingMessage: string = '';

  constructor(
    private matDialog: MatDialog,
    private restService: RestService,
  ) {

  }

  ngOnInit() {
  }

  OpenGroup(event: any) {
    this.selectedGroup = event;
  }

  getMessages() {
    this.restService.post(`Message/GetMessages?GroupId=${this.selectedGroup.groupId}`, null).subscribe((res) => {
      console.log(res);
    });
  }

  sendMessage() {
    let data = {
      message: this.sendingMessage,
      groupId: this.selectedGroup.groupId,
    }
    this.restService.post(`Message/SendMessage`, data).subscribe((res) => {
      console.log(res);
      this.sendingMessage = '';
    });
  }

  OpenGroupInfo(group: Group) {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(GroupInfoComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      data: group
    })
  }

}

class Message {
  message: string;
  sender: User;

  constructor(m: any) {
    this.message = m.message;
    this.sender = m.sender;
  }
}

class User {
  name: string;
  image: string;

  constructor(user: any) {
    this.name = user.name;
    this.image = user.image;
  }

}
