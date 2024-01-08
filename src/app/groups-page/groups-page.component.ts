import { Component, OnInit } from '@angular/core';
import { Group } from '../show-groups/show-groups.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupInfoComponent } from '../group-info/group-info.component';
import { RestService } from '../shared/services/Rest.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  selectedGroup: Group = null;
  messages: Message[] = []

  sendingMessage: string = '';
  allGroups: Group[] = [];
  myGroups: Group[] = [];

  constructor(
    private matDialog: MatDialog,
    private restService: RestService,
  ) {

  }

  ngOnInit() {
    //this.getMessages();
  }

  OpenGroup(event: any) {
    this.selectedGroup = event;
    this.getMessages();
  }

  getMessages() {
    this.restService.post(`Message/GetMessages?GroupId=${this.selectedGroup.groupId}`, null).subscribe((res: any) => {
      this.messages = res.data.reverse();
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
  messageId: number;
  groupId: number;
  senderUserId: string;
  content: string;
  sentTime: Date
  areYouSender: boolean;
  senderImageUrl: string

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
