import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/user-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})

export class VerifyComponent implements OnInit {

  public verifyUserToken:any;
  public verified:boolean;
  constructor(private userMgmtService: UserManagementService, private router: Router, private activatedRoute : ActivatedRoute,private toastr: ToastrService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
      this.verifyUserToken = params['verifyUserToken']
    })
    this.verifyUserFunction()
  }

  public verifyUserFunction: any = ()=>{
    let data={
      verifyUserToken : this.verifyUserToken
    }
    this.userMgmtService.verifyUser(data).subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
          this.verified = true;
      } else {
        this.verified = false;
      }
    },(err)=>{
      // console.log(err)
      this.toastr.error('Some Error Occured')
    })
  }

}