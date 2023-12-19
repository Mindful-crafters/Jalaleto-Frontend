
import { MatFormFieldModule} from '@angular/material/form-field';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { NavbarFooterModule } from '../navbar-footer.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@NgModule({
    declarations: [
        ProfileComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        NavbarFooterModule,
        NzPopoverModule,
    ],
    exports: [
        ProfileComponent,
    ]
})
export class ProfileModule { }
