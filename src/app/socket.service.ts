import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import * as io from 'socket.io-client'
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // socket: any;
// readonly uri: string = "ws://localhost:3000";
socket = io(environment.socketIoURL);
// socket = io("http://localhost:8081");
  constructor() { 
    // this.socket = io(this.uri)
  }

  listen(eventName: string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName, (data:any) =>{
        subscriber.next(data);
      })
    })
  }

  emit(eventName: string, data:any){
    this.socket.emit(eventName, data)
  }
}
