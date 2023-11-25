import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SignupModule } from './sign-up/sign-up.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    ForgetPasswordComponent,
    NewPasswordComponent,
    LoginComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SignupModule,
    HttpClientModule,
    DashboardModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
