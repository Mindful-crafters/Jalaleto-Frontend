import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupInfoComponent } from '../group-info/group-info.component';
import { RestService } from '../shared/services/Rest.service';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../shared/services/auth.service';
import { Group } from '../shared/types/Group';
import { ShowEventsComponent } from '../show-events/show-events.component';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {


  selectedGroup: Group = null;
  messages: Message[] = [];
  sendingMessage: string = '';
  private hubConnection: HubConnection;
  allGroups: Group[] = [];
  myGroups: Group[] = [];


  constructor(
    private matDialog: MatDialog,
    private restService: RestService,
    private authService: AuthService,
  ) {

  }

  ngOnDestroy(): void {
    this.stopConnection();
  }

  ngOnInit() {
    //this.getMessages();
  }

  OpenGroup(event: any) {
    this.selectedGroup = event;
    console.log('s', this.selectedGroup.imageUrl)
    this.getMessages();
    this.hubInit();
  }

  public hubInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('wss://dev.jalaleto.ir/MessageHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start().then(() => {
      console.log('connection started');
      this.hubConnection
        .invoke('joinGroupHub', this.selectedGroup.groupId)
        .catch(err => console.log(err));
    }).catch(err => console.log(err));

    this.hubConnection.onclose(() => {
      console.log('try to re start connection');
      this.hubConnection.start().then(() => {
        console.log('connection re started');
      }).catch(err => console.log(err));
    });

    this.hubConnection.on('NewMessage', (data) => {
      let newMessage: Message = data;

      if (newMessage.senderUserId === this.authService.getUserId) {
        newMessage.areYouSender = true;
      } else {
        newMessage.areYouSender = false;
      }
      this.messages.unshift(data);
    });
  }

  public stopConnection() {
    this.hubConnection.stop().then(() => {
      console.log('stopped');
    }).catch(err => console.log(err));
  }

  getMessages() {
    this.messages = [];
    this.restService.post(`Message/GetMessages?GroupId=${this.selectedGroup.groupId}`, null).subscribe((res: any) => {
      this.messages = res.data.reverse();
      console.log(this.messages[0].senderImageUrl)
    });

  }

  sendMessage() {
    let data = {
      message: this.sendingMessage,
      groupId: this.selectedGroup.groupId,
    }
    this.restService.post(`Message/SendMessage`, data).subscribe((res) => {
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

  OpenShowEvents() {
    const dialogRef: MatDialogRef<any, any> = this.matDialog.open(ShowEventsComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      data: this.selectedGroup.groupId
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
  senderImageUrl: string;
  senderName: string

  constructor(m: any) {
    this.message = m.message;
    this.sender = m.sender;
    this.senderImageUrl = m.sender.image;
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
