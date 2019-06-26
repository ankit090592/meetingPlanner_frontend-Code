import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { UserPlannerComponent } from './user-planner/user-planner.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RouteGuardService } from '../route-guard.service';

@NgModule({
  declarations: [UserPlannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'user-planner', component: UserPlannerComponent, canActivate:[RouteGuardService] }
  ]),
  CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory
  })
  ],
  providers: [RouteGuardService]
})
export class UserPlainModule { }