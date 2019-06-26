import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/user-management.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {

  public email: any
  model: any = {}
  constructor(private userMgmtService: UserManagementService, private socketService: SocketService, private router: Router, private toastr: ToastrService,
    private location: Location) { }

  ngOnInit() {
  }

  public goToSignIn: any = () => {

    // this.router.navigate(['/']);
    this.location.back();

  } // end goToSignIn
  

  onSubmit() {
    let data = {
      email: this.model.email
    }

    this.userMgmtService.validateEmail(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(data.email, 'Email with password reset link sent to:')
      } else {
        this.toastr.warning(apiResponse.message)
      }
    }, (err) => {
      // console.log(err)
      this.toastr.error(err.message)
    })
  }

}
