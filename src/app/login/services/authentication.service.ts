import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  constructor(private http: HttpClient) {
   }

   login(payload:any){
    // payload.userStatus = "Active"
    const url = environment.apiUrl+"login"
    return this.http.post<any>(url, payload)
   }

   withoutLogin(payload:any){
    // payload.userStatus = "Active"
    const url = environment.apiUrl+"withoutLogin"
    return this.http.post<any>(url, payload)
   }

   signup(payload:any){
    payload.userStatus = "Active"
    const url = environment.apiUrl+"registerUser"
    return this.http.post<any>(url, payload)
   }
}
