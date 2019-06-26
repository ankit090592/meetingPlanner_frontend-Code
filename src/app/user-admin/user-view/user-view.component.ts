import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { UserManagementService } from 'src/app/user-management.service';
import { Cookie } from 'ng2-cookies';
import { MeetingService } from 'src/app/meeting.service';
import { formatDate } from '@angular/common'
import * as $ from "jquery";
import { isSameDay, isSameMonth } from 'date-fns';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css'],
  providers : [SocketService]
})

export class UserViewComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent')
  public modalContent: TemplateRef<any>;
  public pageFound: boolean;
  public authToken: any;
  public userInfo: any;
  public fullName: any;
  public startTime: any;
  public endTime: any;
  public user: any;
  public meetingTitle: any;
  public meetingVenue: any;
  public meetingDetails: any;
  public readOnly: any;
  public refresh: Subject<any> = new Subject();
  public viewDate: Date = new Date(); // setting current date tab in calendar
  public events: any = []; // declaring array of events
  public view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = true;
  CalendarView = CalendarView
  
  constructor(private userMgmtService: UserManagementService, private meetingService: MeetingService, private socketService: SocketService,
    private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private modal: NgbModal) { }

  ngOnInit() {
    this.userInfo = this.userMgmtService.getUserInfoFromLocalStorage()
    this.authToken = Cookie.get('authToken')
    console.log("Auth Token in user-view: " +this.authToken)
    this.fullName = Cookie.get('fullName')
    // console.log("Userinfo: admin: " + JSON.stringify(this.userInfo['fullName']))
    this.verifyAdmin()
    this.getUserDetails()
    this.joinUserRoom()
    this.updateMeetingsInView()
    this.deleteMeetingsFromView()
    this.setDefaultMeetingTime()
    this.authError()
  }


  public verifyAdmin: any = () => {
    this.socketService.verifyUser().subscribe(
      data => {
        console.log("Inside verifyAdmin")
        this.socketService.setAdmin(this.authToken)
      }
    )
  }

  public joinUserRoom: any = () => {

    this.socketService.startAdminRoom().subscribe(
      data => {
        console.log("Inside joinUserRoom")
        this.socketService.joinRoom(this.activatedRoute.snapshot.paramMap.get('userId'))
      }
    )
  }

  public getUserDetails: any = () => {
    this.userMgmtService.getUserDetails(this.activatedRoute.snapshot.paramMap.get('userId')).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.user = apiResponse.data
          this.pageFound = true
          this.getUserMeetings()
        } else {
          this.pageFound = false;
        }
      }
    )
  }

  public getUserMeetings: any = () => {
    this.meetingService.getAllUserMeetings(this.activatedRoute.snapshot.paramMap.get('userId')).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.events = apiResponse.data
          // console.log("In frontend dashboard meetings data: " + JSON.stringify(this.events))
        } else {
          this.toastr.warning('This user has no meetings scheduled!')
        }
      }
    )
  }

  public setDefaultMeetingTime: any = () => {
    // set start time to current time
    this.startTime = new Date()
    // set end time = start time + 15 minutes
    this.endTime = new Date()
    this.endTime.setMinutes(this.endTime.getMinutes() + 15)
  }

  public currentTimeOnly: any = () => {
    this.startTime = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), new Date().getHours(), new Date().getMinutes())
    this.endTime = new Date(this.endTime.getFullYear(), this.endTime.getMonth(), this.endTime.getDate(), new Date().getHours(), new Date().getMinutes()+15)
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      this.startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), new Date().getMinutes())
      this.endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), new Date().getMinutes()+15)
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  public handleEvent(action: string, event: any): void {
    this.meetingDetails = { action, event }
    this.startTime = this.meetingDetails.event.start
    this.endTime = this.meetingDetails.event.end
    this.meetingTitle = this.meetingDetails.event.title
    this.meetingVenue = this.meetingDetails.event.venue
    this.readOnly = true;
    this.modal.open(this.modalContent, { centered: true });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  public createNewMeeting: any = () => {
    let newMeeting = {
      title: this.meetingTitle,
      adminId: this.userInfo.userId,
      adminFullName: this.fullName,
      adminUserName: this.userInfo.userName,
      userId: this.activatedRoute.snapshot.paramMap.get('userId'),
      userFullName: (this.user.firstName + ' ' + this.user.lastName).trim(),
      userEmail: this.user.email,
      start: new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), this.startTime.getHours(), this.startTime.getMinutes(), this.startTime.getSeconds()),
      end: new Date(this.endTime.getFullYear(), this.endTime.getMonth(), this.endTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes(), this.endTime.getSeconds()),
      venue: this.meetingVenue
    }
    $('#createMeetingModal .cancel').click();
    if ((Math.floor((this.endTime.getTime() - this.startTime.getTime())) / 60000 > 0) &&
    (new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), this.startTime.getHours(), this.startTime.getMinutes()) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes())) &&
    (new Date(this.endTime.getFullYear(), this.endTime.getMonth(), this.endTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes()) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes())) ) {
      this.socketService.createNewMeeting(newMeeting)
      // console.log("Inside frontend: creatNewMeeting")
    } else {
      this.toastr.error(`Invalid date provided!`)
    }
  }

  public updateMeetingsInView: any = () => {
    this.socketService.getNewOrEditedMeetings().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          if (!Array.isArray(this.events)) {
            this.events = []
          }
          let checkEventIndex = this.events.map(function(event) { return event.meetingId}).indexOf(apiResponse.data.meetingId)
          if (checkEventIndex === -1) {
            this.events.push(apiResponse.data)
            // if (apiResponse.data.adminId == this.userInfo.userId) {
              this.toastr.success('Tap to view','A new meeting scheduled for ' + (this.user.firstName + ' ' + this.user.lastName).trim(), { enableHtml: true, disableTimeOut: true, closeButton: true })
              .onTap
              .subscribe(() => this.toasterClickedHandler(apiResponse.data));   
            // } else {
            //   this.toastr.success(`<b>Title: </b>${apiResponse.data.title}<br><b>Venue: </b>${apiResponse.data.venue}`, 'A new meeting is CREATED by ' + apiResponse.data.adminFullName, { enableHtml: true, disableTimeOut: true, closeButton: true })
            //   .onTap
            //   .subscribe(() => this.toasterClickedHandler(apiResponse.data));              
            // }
          } else {
            this.events[checkEventIndex] = apiResponse.data
            // if (apiResponse.data.adminId == this.userInfo.userId) {
              this.toastr.success('Tap to view','Meeting successfully updated for ' + (this.user.firstName + ' ' + this.user.lastName).trim())
            // } else {
            //   this.toastr.success(`<b>Title: </b>${apiResponse.data.title}<br><b>Venue: </b>${apiResponse.data.venue}`, 'A Meeting has been UPDATED', { enableHtml: true, disableTimeOut: true, closeButton: true })
            // }
          }
          this.refresh.next()
        } else {
          this.toastr.error(apiResponse.message)
        }
      }
    )
  }

  public toasterClickedHandler: any = (apiResponse) => {
    // console.log('Toastr clicked');
    this.handleEvent('Clicked', apiResponse)
  }

  public deleteMeetingsFromView: any = () => {
    this.socketService.deleteMeetingFromView().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          if (!Array.isArray(this.events)) {
            this.events = []
          }
          let checkEventIndex = this.events.map(event => event.meetingId ).indexOf(apiResponse.data.meetingId)
          if (checkEventIndex !== -1) {
            this.events.splice(checkEventIndex, 1)
            if (apiResponse.data.adminId == this.userInfo.userId) {
              this.toastr.success('Meeting successfully deleted')
            } else {
              this.toastr.success(`<b>Title: </b>${apiResponse.data.title}<br><b>Venue: </b>${apiResponse.data.venue}<br><b>Start: </b>${formatDate(apiResponse.data.start, 'd MMM hh:mm a', 'en')}<br><b>End: </b>${formatDate(apiResponse.data.end, 'd MMM hh:mm a', 'en')}`, 'A Meeting has been cancelled!', { enableHtml: true, disableTimeOut: true, closeButton: true })
            }
          }
          this.refresh.next()
        } else {
          this.toastr.error(apiResponse.message)
        }
      }
    )
  }

  public validateCreateMeeting: any = () => {
    if (new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate()) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
      return true
    }
    return false
  }


  public editMeeting: any = () => {
    if ((Math.floor((this.endTime.getTime() - this.startTime.getTime())) / 60000 > 0) &&
    (new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), this.startTime.getHours(), this.startTime.getMinutes()) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes())) &&
    (new Date(this.endTime.getFullYear(), this.endTime.getMonth(), this.endTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes()) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes())) ) {
      this.meetingDetails.event.start = this.startTime
      this.meetingDetails.event.end = this.endTime
      this.meetingDetails.event.title = this.meetingTitle
      this.meetingDetails.event.venue = this.meetingVenue
      this.socketService.updateMeeting(this.meetingDetails.event)
      // $('#deleteMeetingModal .cancel').click();
    } else {
      this.toastr.error(`Oops! A meeting can't end before it starts.`)
    }
  }


  public deleteMeeting: any = (meeting) => {
    this.socketService.deleteMeeting(meeting)
    $('#deleteMeetingModal .cancel').click();
  }


  public logout: any = () => {
    this.userMgmtService.logout().subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken', '/')
          Cookie.delete('authToken', '/admin/dashboard')
          Cookie.delete('authToken', '/admin/user/view')
          localStorage.clear()
          this.socketService.disconnect();
          this.router.navigate(['/login'])
        } else {
          this.toastr.warning(data.message)
        }
      }, err => {
        this.toastr.error(err.message)
      }
    )
  }


  public authError: any = () => {
    this.socketService.authError().subscribe(
      data => {
        Cookie.delete('authToken', '/')
        Cookie.delete('authToken', '/admin/dashboard')
        Cookie.delete('authToken', '/admin/user/view')
        this.router.navigate(['/login'])
      }
    )
  }

  ngOnDestroy() {
    this.socketService.disconnect()
  }
}
