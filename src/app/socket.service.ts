import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private url = "http://api.appdevtest.xyz";
  // private url = 'http://localhost:3000'
  private socket;
  constructor() {
    this.socket = io(this.url)
  }

  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        console.log("Inside verifyAdmin")
        observer.next(data);
      });
    });
  }

  public setUser = (authToken) => {
    this.socket.emit('set-user', authToken);
  }

  public setAdmin = (authToken) => {
    console.log("Inside setAdmin")
    this.socket.emit('set-admin', authToken);
  }

  public startAdminRoom = () => {
    
    return Observable.create((observer) => {
      this.socket.on('start-room', (data) => {
        console.log("Inside frontend socket: startAdminRoom")
        observer.next(data);
      });
    });
  }

  public joinRoom = (userId) => {
    console.log("Inside frontend socket: joinRoom")
    this.socket.emit('join-room', userId)
  }

  public createNewMeeting = (meeting) => {
    this.socket.emit('createNewMeeting', meeting)
    console.log("Inside frontend socket: creatNewMeeting")
  }

  public updateMeeting = (meeting) => {
    // console.log("Inside frontend socket: edit meeting")
    this.socket.emit('edit-meeting', meeting)
  }
  
  public getNewOrEditedMeetings = () => {
    return Observable.create((observer) => {
      this.socket.on('update-meeting', (data) => {
        data['data'].start = new Date(data['data'].start)
        data['data'].end = new Date(data['data'].end)
        observer.next(data);
      });
    });
  }


  public deleteMeeting = (meeting) => {
    this.socket.emit('delete-meeting', meeting)
  }

  public deleteMeetingFromView = () => {
    return Observable.create((observer) => {
      this.socket.on('delete-meeting', (data) => {
        observer.next(data);
      });
    });
  }

  
  public meetingAlarm = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  public disconnect = () => {
    this.socket.disconnect()
  }


  public authError = () => {
    return Observable.create((observer) => {
      this.socket.on('auth-error', (data) => {
        observer.next(data);
      });
    });
  }
}