import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { TimelineComponent } from '../timeline/timeline.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@NgModule({
    declarations: [
        DashboardComponent,
        NavbarComponent,
        FooterComponent,
        TimelineComponent
    ],
    exports: [
        DashboardComponent,
        MatButtonModule,
        MatRippleModule

    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        NzPopoverModule
    ]
})
export class DashboardModule { }
