import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from './rooms/services/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat';
  constructor(private router:Router) {
   
  }
  ngOnInit(){
    if(!localStorage.getItem('userId')){
      this.router.navigate(['login']);
      return;
      }
  }
}
