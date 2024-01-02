import { DashboardComponent } from './../dashboard/dashboard.component';
import { Router } from '@angular/router';
import { AuthService } from './../shared/services/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { RestService } from './../shared/services/Rest.service';
import { RouterModule, Routes } from '@angular/router';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';


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
  private hubConnection: HubConnection;

  @Output() logedOut: EventEmitter<boolean> = new EventEmitter<boolean>();
last: any;

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
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }

  public hubInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('wss://dev.jalaleto.ir/Hub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start().then(() => {
      console.log('connection started');
    }).catch(err => console.log(err));

    this.hubConnection.onclose(() => {
      setTimeout(() => {
        console.log('try to re start connection');
        this.hubConnection.start().then(() => {
          console.log('connection re started');
        }).catch(err => console.log(err));
      }, 5000);
    });

    this.hubConnection.on('newNotificationRecived', (data) => {
      console.log('new Notification Recived:' + data);
      this.getNotifications();
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
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
}

interface UserProfile {
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
