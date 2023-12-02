import { AuthService } from './../shared/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../shared/services/Rest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isLoggedIn = false;

  constructor(
    private restService: RestService,
    private auth: AuthService, private router: Router,
    private authService : AuthService) {
      this.isLoggedIn = authService.isLoggedIn();

      console.log(this.authService.getToken())
  }

  logOut() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
