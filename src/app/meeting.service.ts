import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private baseUrl = 'http://api.appdevtest.xyz/api/v1/meetings';
  // private baseUrl = 'http://localhost:3000/api/v1/meetings'
  constructor(private http : HttpClient) { }

  public getAllUsers():Observable<any>{
    return this.http.get(`${this.baseUrl}/admin/dashboard?authToken=${Cookie.get('authToken')}`)
  }

  public getAllUserMeetings(userId):Observable<any>{
    return this.http.get(`${this.baseUrl}/userMeetings/${userId}?authToken=${Cookie.get('authToken')}`)
    .pipe(map(meetingData =>{
        if(meetingData['status']==200){
         meetingData['data'].forEach(meeting=>{
          meeting.start = new Date(meeting.start)
          meeting.end = new Date(meeting.end)
           }
         )
        }
         return meetingData
       }
     ))
  }
}