import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { TimelineComponent } from '../timeline/timeline.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    declarations: [
        DashboardComponent,
        NavbarComponent,
        FooterComponent,
        TimelineComponent
    ],
    exports: [
        DashboardComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatButtonModule,
        BrowserModule,
        FormsModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        NzPopoverModule,
        MatMenuModule
    ],
})
export class DashboardModule { }
