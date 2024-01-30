import { DashboardComponent } from './../dashboard/dashboard.component';
import { AuthService } from './../shared/services/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { RestService } from './../shared/services/Rest.service';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Router, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userProfile: UserProfile | null = null;
  notifications: Notification[] = [];
  groups: Group[];
  private hubConnection: HubConnection;
  hideRedCircle: boolean = true;

  @Output() logedOut: EventEmitter<boolean> = new EventEmitter<boolean>();
  last: any;
  userInfoLoaded: boolean = false;

  constructor(
    private restService: RestService,
    private auth: AuthService,
    private router: Router,
    private authService: AuthService) {
    3.
    this.isLoggedIn = authService.isLoggedIn();
  }


  ngOnInit() {
    this.fetchUserProfile();
    this.getNotifications();
    this.hubInit();
    this.getGroups();
  }

  getGroups() {
    this.restService.post('Group/Groups?FilterMyGroups=true', null).subscribe((res) => {
      this.groups = res['data'];

      this.groups.forEach((group) => {
        this.hubConnection
          .invoke('joinGroupHub', group.groupId)
          .catch(err => console.log(err));
      })
    })
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }

  public hubInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('wss://dev.jalaleto.ir/MessageHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start().then(() => {
      console.log('connection started');
    }).catch(err => console.log(err));

    this.hubConnection.onclose(() => {
      console.log('try to re start connection');
      this.hubConnection.start().then(() => {
        console.log('connection re started');
      }).catch(err => console.log(err));
    });

    this.hubConnection.on('NewMessage', (data) => {
      console.log(data);
      this.hideRedCircle = false;
      const message: Message = data;
      const group = this.groups.find(g => g.groupId === message.groupId);

      const notif: Notification = {
        title: group.name,
        description: message.content,
        icon: group.imageUrl,
        link: '',
        type: NotificationType.Message,
      }
      this.notifications.push(
        notif
      )
    });
  }

  public stopConnection() {
    this.hubConnection.stop().then(() => {
      console.log('stopped');
    }).catch(err => console.log(err));
  }

  viewProfile() {
    this.router.navigate(['/profile'])
  }

  openSettings() {

  }

  Events() {


  }

  clickedOnNotification = false;
  
  clickedOnNotif(){
    this.hideRedCircle = true;
    this.clickedOnNotification = true;
  }

  getNotifications() {
    this.restService.post('Notification/Get', null).subscribe(
      (res: any) => {
        console.log(res);
        if (res.success) {
          this.notifications = res.items;
          this.notifications.forEach((notif) => {
            if (notif.type == NotificationType.Reminder) {
              notif.icon = '../../assets/icons/icons8-notification-24.png';
            } else if (notif.type == NotificationType.Event) {
              notif.icon = '../../assets/icons/icons8-event-24.png';
            } else if (notif.type == NotificationType.Message) {
              notif.icon = '../../assets/icons/icons8-message-30.png';
            }
          });
        }
      }
    );
  }




  logout() {
    this.authService.logout();
    this.logedOut.emit(true);
  }


  fetchUserProfile() {
    this.restService.post("User/ProfileInfo", null).subscribe(
      (data: UserProfile) => {
        console.log(data);

        this.userProfile = data;
        this.userInfoLoaded = true;

      }
    );
  }

  truncateString(str: string, maxLength: number) {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + '...';
    }
  }
}

export interface UserProfile {
  userName: string;
  email: string;
  avatarUrl: string;
  imagePath: string;
}

interface Notification {
  title: string;
  description: string;
  icon: string;
  link: string;
  type: NotificationType;
}

enum NotificationType {
  Reminder = 0,
  Event = 1,
  Message = 2,
}

interface Message {
  messageId: number;
  groupId: number;
  senderUserId: string;
  content: string;
  sentTime: Date
  areYouSender: boolean;
  senderImageUrl: string
}

export class Group {
  groupId: number = 0;
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  imageFile: File = null;
}
