import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { UserManagementService } from 'src/app/user-management.service';
import { Cookie } from 'ng2-cookies';
import { MeetingService } from 'src/app/meeting.service';
import { formatDate } from '@angular/common'
import { isSameDay, isSameMonth } from 'date-fns';

@Component({
  selector: 'app-user-planner',
  templateUrl: './user-planner.component.html',
  styleUrls: ['./user-planner.component.css'],
  providers : [SocketService]
})

export class UserPlannerComponent implements OnInit {
  
  @ViewChild('modalContent')
  public modalContent: TemplateRef<any>;
  @ViewChild('modalAlarm')
  public modalAlarm: TemplateRef<any>;
  public alarmContent: any;
  public authToken: any;
  public userInfo: any;
  public userFullName: any;
  public userName: any;
  public meetingDetails: any;
  public refresh: Subject<any> = new Subject();
  public viewDate: Date = new Date(); // for current date
  public events: any = []; // array of events/meetings
  public view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = true;
  CalendarView = CalendarView
  constructor(private userMgmtService: UserManagementService, private meetingService: MeetingService, private socketService: SocketService,
    private router: Router, private toastr: ToastrService, private modal: NgbModal) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken')
    this.userName = Cookie.get('userName')
    this.userFullName = Cookie.get('fullName').toUpperCase()
    this.userInfo = this.userMgmtService.getUserInfoFromLocalStorage()
    this.verifyUserConfirmation()
    this.getUserMeetings()
    this.updateMeetingsInView()
    this.deleteMeetingsFromView()
    this.meetingAlarm()
    this.authError()
  }


  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      data => {
        this.socketService.setUser(this.authToken)
      }
    )
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
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

  public handleEvent(action: string, event: CalendarEvent): void {
    this.meetingDetails = { action, event }
    this.modal.open(this.modalContent, { centered: true });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  public getUserMeetings: any = () => {
    this.meetingService.getAllUserMeetings(this.userInfo.userId).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.events = apiResponse.data
          // console.log("In frontend meetings data: " + JSON.stringify(this.events))
        } else {
          this.toastr.warning('You have no meetings scheduled!')
        }
      }
    )
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
            this.toastr.success(`<b>Title: </b>${apiResponse.data.title}<br><b>Venue: </b>${apiResponse.data.venue} `, 'A new meeting has been CREATED by: ' + apiResponse.data.adminFullName, { enableHtml: true, disableTimeOut: true, closeButton: true })
          } else {
            this.events[checkEventIndex] = apiResponse.data
            this.toastr.success(`<b>Title: </b>${apiResponse.data.title}<br><b>Venue: </b>${apiResponse.data.venue}<br>`, 'A meeting has been UPDATED!', { enableHtml: true, disableTimeOut: true, closeButton: true })
          }
          this.refresh.next()
        } else {
          this.toastr.error(apiResponse.message)
        }
      }
    )
  }

  public deleteMeetingsFromView: any = () => {
    this.socketService.deleteMeetingFromView().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          if (!Array.isArray(this.events)) {
            this.events = []
          }
          let checkEventIndex = this.events.map(event => event.meetingId).indexOf(apiResponse.data.meetingId)
          if (checkEventIndex !== -1) {
            this.events.splice(checkEventIndex, 1)
            this.toastr.success(`<b>Title: </b>${apiResponse.data.title}<br><b>Venue: </b>${apiResponse.data.venue}<br><b>Start: </b>${formatDate(apiResponse.data.start, 'd MMM hh:mm a', 'en')}<br><b>End: </b>${formatDate(apiResponse.data.end, 'd MMM hh:mm a', 'en')}`, 'A meeting has been Cancelled!', { enableHtml: true, disableTimeOut: true, closeButton: true })
          }
          this.refresh.next()
        } else {
          this.toastr.error(apiResponse.message)
        }
      }
    )
  }

  public meetingAlarm: any = () => {
    this.socketService.meetingAlarm(this.userInfo.userId).subscribe(
      data => {
        this.alarmContent = data;
        this.modal.open(this.modalAlarm, { centered: true });
      }
    )
  }

  public revokeAlarm: any = () => {
    this.toastr.success('Alarm snoozed for 1 minute.')
    setTimeout(() => {
      this.modal.open(this.modalAlarm, { centered: true });
    }, 60000)
  }

  public logout: any = () => {
    this.userMgmtService.logout().subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken', '/')
          Cookie.delete('authToken', '/user-planner')
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
        Cookie.delete('authToken')
        this.router.navigate(['/login'])
      }
    )
  }


  ngOnDestroy() {
    this.socketService.disconnect()
  }

}