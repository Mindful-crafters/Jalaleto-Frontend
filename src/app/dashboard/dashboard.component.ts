import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { RestService } from '../shared/services/Rest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private restService: RestService,
    private auth: AuthService, private router: Router) {
  }

  logOut() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
