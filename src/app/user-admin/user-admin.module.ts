import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserViewComponent } from './user-view/user-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RouteGuardService } from '../route-guard.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AdminDashboardComponent, UserViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [RouteGuardService] },
      { path: 'admin/user/view/:userId', component: UserViewComponent, canActivate: [RouteGuardService] }
    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    NgbModule
  ],
  providers: [RouteGuardService]
})
export class UserAdminModule { }