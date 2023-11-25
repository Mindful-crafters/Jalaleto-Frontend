import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/services/auth.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignUpComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home' , component: HomepageComponent},
  { path: 'signup', component: SignUpComponent },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  { path: 'newpassword', component: NewPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
