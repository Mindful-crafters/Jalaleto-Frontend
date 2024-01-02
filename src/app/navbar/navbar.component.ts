import { DashboardComponent } from './../dashboard/dashboard.component';
import { Router } from '@angular/router';
import { AuthService } from './../shared/services/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { RestService } from './../shared/services/Rest.service';
import { RouterModule, Routes } from '@angular/router';


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
  @Output() logedOut:EventEmitter<boolean> = new EventEmitter<boolean>();
  userInfoLoaded:boolean=false;

  constructor(
    private restService: RestService,
    private auth: AuthService,
    private router: Router,
    private authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn();
  }


  ngOnInit() {
    this.fetchUserProfile();
  }


  viewProfile() {
    this.router.navigate(['/profile'])
  }

  openSettings() {

  }

  Events() {

  }

  toggleNotifications() {
    this.restService.post('Notification/Get',null).subscribe(
      (res:any)=>{
        console.log(res);
        if(res.success){
          this.notifications = res.items;
          this.notifications.forEach((notif )=>{
            if(notif.type == NotificationType.Reminder){
              notif.icon =  '../../assets/icons/icons8-notification-24.png'
            }
          })
        }

      }

    )
    // this.notifications = [
    //   {
    //     title: 'اعلان 1',
    //     description: 'Description for Notification 1',
    //     icon: '../../assets/icons/icons8-notification-24.png',
    //     link: '/notifications/اعلان 1'
    //   },
    //   {
    //     title: 'اعلان 2',
    //     description: 'Description for Notification 2',
    //     icon: '../../assets/icons/icons8-notification-24.png',
    //     link: '/notifications/اعلان 2'
    //   },
    // ];
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
  // seen : boolean;
}

enum NotificationType {
  Reminder = 0,
}
