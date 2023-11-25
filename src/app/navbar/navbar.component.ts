import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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
