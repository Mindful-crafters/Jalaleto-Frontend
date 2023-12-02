import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';


import { TimelineComponent } from '../timeline/timeline.component';
import { MatButton } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
    declarations: [
        DashboardComponent,
        NavbarComponent,
        FooterComponent,
        TimelineComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatIconModule,
        NzPopoverModule,
        MatButtonModule,
        MatRippleModule,
        BrowserModule,
        FormsModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMenuModule
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule { }
