import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
    declarations: [
        SignUpComponent
    ],
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatButtonModule,
        BrowserModule,
        AppRoutingModule,
        MatInputModule,
        FormsModule,
        NgOtpInputModule
    ],
    exports: [
        SignUpComponent
    ]
})
export class SignupModule { }