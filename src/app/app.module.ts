import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserManagementModule } from './user-management/user-management.module';
import { UserPlainModule } from './user-plain/user-plain.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './user-management/login/login.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { UserManagementService } from './user-management.service';
import { SocketService } from './socket.service';
import { MeetingService } from './meeting.service';
import { UserAdminModule } from './user-admin/user-admin.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    UserManagementModule,
    UserPlainModule,
    UserAdminModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: LoginComponent },
      { path: '**', component: LoginComponent }
    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [UserManagementService,SocketService,MeetingService],
  bootstrap: [AppComponent]
})
export class AppModule { }