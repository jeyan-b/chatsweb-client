import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  
  allPublicRoomsEvent = new Subject<any>();
  groupChatMessage = new Subject<any>();
  selectedRoom =new Subject<any>();
  checkUsers =new Subject<any>();
 groupsLoader =new Subject<any>();
 usersLoader =new Subject<any>();
  public users = [];
  public tabs = [];
  public roomSpecificUsers = [];
  public allGroups = [];

  constructor(private http: HttpClient) {
   }

   savePublicMessage(payload:any){
    const url = environment.apiUrl+"publicMsg"
    return this.http.post<any>(url, payload)
   }

   savePrivateMessage(payload:any){
    const url = environment.apiUrl+"privateMsg"
    return this.http.post<any>(url, payload)
   }
   
   openChat(payload:any){
    const url = environment.apiUrl+"openChat"
    return this.http.post<any>(url, payload)
   }
   
   openGroup(payload:any){
    const url = environment.apiUrl+"openGroup"
    return this.http.post<any>(url, payload)
   }

   joinGroupById(id:any, payload:any){
    const url = environment.apiUrl+"openGroup/"+id
    return this.http.put<any>(url, payload)
   }

   getAllUsers(){
    const url = environment.apiUrl+"users"
    return this.http.get<any>(url)
   }
 
   getAllGroups(){
    const url = environment.apiUrl+"groups"
    return this.http.get<any>(url)
   }

   userDataById(id:any){
    const url = environment.apiUrl+"userDataById/"+id
    return this.http.get<any>(url)
   }

   updateUserDataById(id:any, payload:any){
    const url = environment.apiUrl+"updateUserById/"+id
    return this.http.put<any>(url, payload)
   }

   deleteUser(id:any){
    const url = environment.apiUrl+"deleteUserById/"+id
    return this.http.delete<any>(url)
   }

   getGroupById(id:any){
    const url = environment.apiUrl+"groupById/"+id
    return this.http.get<any>(url)
   }

   getPrivateMessage(){
    const url = environment.apiUrl+"users"
    return this.http.get<any>(url)
   }
   
   logout(payload:any){
    const url = environment.apiUrl+"logout"
    return this.http.post<any>(url, payload)
   }
}
