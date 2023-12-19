import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router:Router){
    this.router.events.subscribe((event)=>
    {
      if(event instanceof NavigationEnd)
      {
        this.showNavbar();
      }
    })
  }
  showNavbar(): boolean
  {
    return this.router.url !== '/login';
  }
  title = 'Jalaleto';
}
