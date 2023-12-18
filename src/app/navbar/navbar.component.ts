import { Router } from '@angular/router';
import { AuthService } from './../shared/services/auth.service';
import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private authService: AuthService) {

  }
  isLoggedIn = true;
  viewProfile() {
    this.router.navigate(['/profile'])
  }

  openSettings() {

  }

  Events() {

  }



  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

}
