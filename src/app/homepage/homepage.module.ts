import { MatFormFieldModule } from '@angular/material/form-field';
import { HomepageComponent } from './homepage.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Remove duplicated import
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

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
    MatButtonModule,
    ReactiveFormsModule,  // Keep only one import for FormsModule or ReactiveFormsModule
    MatInputModule
  ],
  exports: [
    HomepageComponent
  ],

})
export class HomepageModule { }