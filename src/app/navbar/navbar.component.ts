import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {

  viewProfile() {
    console.log('View Profile');
  }

  openSettings(){

  }

  Events(){

  }



  logout() {
    console.log('Logout');
  }

}
