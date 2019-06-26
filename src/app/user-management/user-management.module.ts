import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPwdComponent, VerifyComponent, ResetPwdComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'signup', component: SignupComponent },
      { path: 'forgotPwd', component: ForgotPwdComponent },
      { path: 'resetPwd', component: ResetPwdComponent },
      { path: 'verifyUser', component: VerifyComponent },
    ])
  ]
})
export class UserManagementModule { }