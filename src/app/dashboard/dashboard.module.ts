import { ShowGroupsComponent } from './../show-groups/show-groups.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { NavbarFooterModule } from '../navbar-footer.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from "../shared/persion-date.adapter";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReminderDialogComponent } from '../timeline/reminder-dialog/reminder-dialog/reminder-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';



@NgModule({
    declarations: [
        DashboardComponent,
        TimelineComponent,
        ShowGroupsComponent,
        ReminderDialogComponent
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatIconModule,
        NzPopoverModule,
        MatRippleModule,
        MatButtonModule,
        BrowserModule,
        FormsModule,
        FormsModule,
        MatChipsModule,
        NgxMatTimepickerModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMenuModule,
        NavbarFooterModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    exports: [
        DashboardComponent
    ]

})
export class DashboardModule { }
