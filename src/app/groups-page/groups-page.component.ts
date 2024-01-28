import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupInfoComponent } from '../group-info/group-info.component';
import { RestService } from '../shared/services/Rest.service';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../shared/services/auth.service';
import { Group } from '../shared/types/Group';
import { ShowEventsComponent } from '../show-events/show-events.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  userProfile: any;
  isLoaded: boolean = false;
  chatLoading: boolean = false;

  myGroupsLoading: boolean = false;
  allGroupsLoading: boolean = false;

  constructor(
    private matDialog: MatDialog,
    private restService: RestService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {

  }

  ngOnDestroy(): void {
    this.stopConnection();
  }

  ngOnInit() {
    this.fetchUserProfile();
    this.allGroupsLoading = true;
    this.myGroupsLoading = true;

    this.restService.post('Group/Groups?FilterMyGroups=false', null).subscribe((res) => {
      console.log(res);
      this.allGroups = res['data'];
      this.allGroupsLoading = false;
    })

    this.restService.post('Group/Groups?FilterMyGroups=true', null).subscribe((res) => {
      console.log(res);
      this.myGroups = res['data'];
      this.myGroupsLoading = false;
    })
  }

  OpenGroup(event: any) {
    this.chatLoading = true;
    this.selectedGroup = event;
    this.getMessages();
    this.hubInit();
    this.chatLoading = false;
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

  fetchUserProfile() {
    this.restService.post("User/ProfileInfo", null).subscribe(
      (data) => {
        console.log(data);

        if (data['success']) {
          this.userProfile = data;
          this.isLoaded = true;
        }
        else
          this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }

    );
  }

  IsMember() {
    if (!this.selectedGroup)
      return true;
    const b = this.selectedGroup.members.find(m => m.mail == this.userProfile.email);
    return b ? true : false;
  }

  JoinGroup() {
    this.chatLoading = true;
    this.restService.post('Group/JoinGroup?GroupId=' + this.selectedGroup.groupId, null).subscribe((res) => {
      if (res['success']) {

        this.restService.post('Group/GpInfo?GroupId=' + this.selectedGroup.groupId, null).subscribe((response) => {
          if (response['success']) {
            this.OpenGroup(response['data'][0]);
            this.myGroups.push(response['data'][0]);
          }
          else {
            this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
          }
          this.toastr.success('با موفقیت عضو گروه شدید', 'موفقیت');

        })

      }
      else
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');

      this.chatLoading = false;
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
