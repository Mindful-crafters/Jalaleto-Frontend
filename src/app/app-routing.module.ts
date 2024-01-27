import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/services/auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ShowGroupsComponent } from './show-groups/show-groups.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { WorkWithUsComponent } from './work-with-us/work-with-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { RulesComponent } from './rules/rules.component';
import { ShowProfileComponent } from './show-profile/show-profile.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { GroupInfoComponent } from './group-info/group-info.component';
import { EventPageComponent } from './event-page/event-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  { path: 'newpassword', component: NewPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ShowProfileComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'rule', component: RulesComponent },
  { path: 'work', component: WorkWithUsComponent },
  { path: 'groups', component: GroupsPageComponent },
  { path: 'member', component: GroupInfoComponent },
  { path: 'event', component: EventPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
