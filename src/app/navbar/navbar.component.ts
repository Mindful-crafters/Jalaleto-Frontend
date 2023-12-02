import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {

  constructor(private router: Router) {}

  viewProfile() {
    console.log('View Profile');
  }

  openSettings(){

  }

  Events(){

  }



  logout() {

    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
