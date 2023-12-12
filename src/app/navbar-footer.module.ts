import { NgModule } from '@angular/core';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatButtonModule } from '@angular/material/button';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatInputModule } from '@angular/material/input';
// import { AppRoutingModule } from '../app-routing.module';
// import { BrowserModule } from '@angular/platform-browser';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { NgxOtpInputModule } from 'ngx-otp-input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
    declarations: [
        NavbarComponent,
        FooterComponent
    ],
    imports: [
        MatMenuModule,
        MatButtonModule,
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
    ]
})
export class NavbarFooterModule { }