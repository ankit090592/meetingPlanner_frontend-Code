import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Cookie } from 'ng2-cookies';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserManagementService {
  private baseUrl = 'http://api.appdevtest.xyz/api/v1/users';
  // private baseUrl = 'http://localhost:3000/api/v1/users'
  constructor(public http: HttpClient) { }


  //------------------------------ user functions -------------------------------------- 
  //getter function for getting any local user info if it is already saved
  //this function is used in user Module login.component.ts
  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  //setter function for setting any user info in local Storage for session management
  //this function is used in user Module login.component.ts
  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  //send data parameters using HttpParams() and sending it as 1 param
  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('countryCode', data.countryCode)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.baseUrl}/signup`, params)
  }

  public verifyUser(data): Observable<any> {
    const params = new HttpParams()
    .set('verifyUserToken',data.verifyUserToken)
    return this.http.post(`${this.baseUrl}/verifyUser`,params)
  }

  public validateEmail(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
    return this.http.post(`${this.baseUrl}/forgotPwd`, params)
  }

  public resetPwd(data): Observable<any> {
    const params = new HttpParams()
      .set('password', data.password)
      .set('resetPwdToken', data.resetPwdToken)
    return this.http.post(`${this.baseUrl}/resetPwd`, params)
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.baseUrl}/login`, params)
  }

  public getUserDetails(userId):Observable<any>{
    return this.http.get(`${this.baseUrl}/userDetails/${userId}?authToken=${Cookie.get('authToken')}`)
  }

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    let userdetails = this.getUserInfoFromLocalStorage();

    return this.http.post(`${this.baseUrl}/logout/${userdetails.userId}`, params);

  } // end logout function
}