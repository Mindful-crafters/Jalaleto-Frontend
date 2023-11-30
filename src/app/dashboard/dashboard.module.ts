import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@NgModule({
    declarations: [
        DashboardComponent,
        TimelineComponent
    ],
    exports: [
        DashboardComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatRippleModule,
        NzPopoverModule
    ]
})
export class DashboardModule { }