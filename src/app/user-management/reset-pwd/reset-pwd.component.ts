import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from 'src/app/user-management.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})

export class ResetPwdComponent implements OnInit {
  public password: any
  model: any = {}
  public resetPwdToken:any;
  constructor(private userMgmtService: UserManagementService, private router: Router, private activatedRoute : ActivatedRoute,private toastr: ToastrService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resetPwdToken = params['resetPwdToken']
    })
  }

  onSubmit() {
    let data = {
      password: this.model.password,
      resetPwdToken: this.resetPwdToken
    }

    this.userMgmtService.resetPwd(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success('Password successfully changed!')
        setTimeout(() => { this.router.navigate(['/login']) }, 2000)
      } else {
        this.toastr.error(apiResponse.message)
      }
    }, (err) => {
      // console.log(err)
      this.toastr.error(err.message)
    })
  }

}
