import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [
        DashboardComponent,
        NavbarComponent,
        FooterComponent

    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule { }
