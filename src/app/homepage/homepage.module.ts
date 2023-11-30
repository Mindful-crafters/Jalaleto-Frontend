import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './homepage.component';


@NgModule({
  declarations: [
      HomepageComponent,
  ],
  imports: [
      BrowserAnimationsModule,
      HttpClientModule,
      AppRoutingModule,
      MatIconModule,
      BrowserModule,
      FormsModule,
      MatButtonModule,
  ],
  exports: [
      HomepageComponent
  ]
})
export class HomepageModule { }
