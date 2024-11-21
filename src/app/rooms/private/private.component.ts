import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationService } from '../services/communication.service';
import { UserAboutComponent } from '../user-about/user-about.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {

  @Input() users: any;
  @Output() openPrivateFromChild = new EventEmitter();
  @Output() mentionFromChild = new EventEmitter();
  currentUserId:any;
  // usersLoader = false;
  constructor(private communicationService: CommunicationService, private dialog: MatDialog,){

  }
  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId')
    // this.communicationService.usersLoader.subscribe(res =>{
    //   this.usersLoader =res;
    // })
  }
  openMenu(name:string){
    // // console.log("open: "+name);
    (document.querySelector(".users-list ul") as HTMLElement).style.overflowY = 'initial';
    (document.getElementById(name) as HTMLElement).style.display = 'block';

  }
  hideMenu(name: string){
    // // console.log("close: "+name);
    // (document.querySelector(".users-list ul") as HTMLElement).style.overflowY = 'auto';
    (document.getElementById(name) as HTMLElement).style.display = 'none';

  }

  aboutClick(currentUser:any){
    const dialogRef = this.dialog.open(UserAboutComponent, {
      width: '450px',
      height: '450px',
      data: {
        userId: currentUser._id
      }
    });
  }
}
