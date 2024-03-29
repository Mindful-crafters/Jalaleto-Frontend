import { ToastrModule } from 'ngx-toastr';

import { MatFormFieldModule } from '@angular/material/form-field';

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
import { AsyncPipe, CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NavbarFooterModule } from '../navbar-footer.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ShowGroupsComponent } from '../show-groups/show-groups.component';
import { ShowProfileComponent } from './show-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
    declarations: [
        ShowProfileComponent,
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
        MatTabsModule,
        MatChipsModule,
        NzSkeletonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatAutocompleteModule
    ],
    exports: [
        ShowProfileComponent,
    ]
})
export class ShowProfileModule { }
