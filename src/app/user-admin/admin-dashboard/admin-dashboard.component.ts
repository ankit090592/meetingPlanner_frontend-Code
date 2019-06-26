import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { UserManagementService } from 'src/app/user-management.service';
import { Cookie } from 'ng2-cookies';
import { MeetingService } from 'src/app/meeting.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers : [SocketService]
})

export class AdminDashboardComponent implements OnInit, OnDestroy {

  public authToken: any;
  public adminInfo: any;
  public allUsers: any;
  public fullName: any;

  constructor(private userMgmtService: UserManagementService, private meetingService: MeetingService, private socketService: SocketService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken')
    this.fullName = Cookie.get('fullName').toUpperCase()
    console.log("AuthToken in admin dash: " +this.authToken)
    this.adminInfo = this.userMgmtService.getUserInfoFromLocalStorage()
    // console.log("adminInfo in admin dash: " +this.adminInfo)
    this.verifyUserConfirmation()
    this.getAllUsers()
    this.authError()
  }


  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      data=>{
        this.socketService.setAdmin(this.authToken)
      }
    )
  }

  public getAllUsers:any = () =>{
    this.meetingService.getAllUsers().subscribe(
      data=>{
        this.allUsers = data['data']
      }
    )
  }

  public logout: any = () => {
    this.userMgmtService.logout().subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken','/')
          Cookie.delete('authToken','/admin/dashboard')
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


  public authError:any = () =>{
    this.socketService.authError().subscribe(
      data=>{
        Cookie.delete('authToken','/')
        Cookie.delete('authToken','/admin/dashboard')
          Cookie.delete('authToken', '/admin/user/view')
        this.router.navigate(['/login'])
      }
    )
  }

  ngOnDestroy() {
    this.socketService.disconnect()
  }
}
