import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/user-management.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any
  public password: any
  model: any = {}
  constructor(public userMgmtService: UserManagementService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }


  public goToSignUp: any = () => {
    this.router.navigate(['/signup'])

  } // end goToSignUp

  
  onSubmit() {
    let data = {
      email: this.model.email,
      password: this.model.password
    }

    this.userMgmtService.signinFunction(data).subscribe((apiResponse) => {
      
      if (apiResponse.status === 200) {
        // console.log(apiResponse)
        Cookie.set("authToken", apiResponse.data.authToken)
        // console.log("authToken from apiResponse in sigin component: " + apiResponse.data.authToken)

        Cookie.set("userId", apiResponse.data.userDetails.userId)

        Cookie.set("fullName", (apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName).trim())
        Cookie.set("userName", apiResponse.data.userDetails.userName)
        apiResponse.data.userDetails['fullName'] = (apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName).trim()
        this.userMgmtService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
        if(apiResponse.data.userDetails.userName.endsWith('-admin')){
          this.router.navigate(['/admin/dashboard'])
        } else {
          this.router.navigate(['/user-planner'])
        }
        this.toastr.success(apiResponse.message)
        

      }  else {
        this.toastr.error(apiResponse.message)
      }
     
    }, (err) => {
      this.toastr.error(err.message)

    })

  }

}
