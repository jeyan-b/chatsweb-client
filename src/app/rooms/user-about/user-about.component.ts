import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-user-about',
  templateUrl: './user-about.component.html',
  styleUrls: ['./user-about.component.scss']
})
export class UserAboutComponent {

  userDetail:any;

  constructor(
    private dialogRef: MatDialogRef<UserAboutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private communicationService: CommunicationService) {
  }
  ngOnInit(){
    console.log(this.data.userId)
    this.communicationService.userDataById(this.data.userId).subscribe(res =>{
      console.log(res)
      this.userDetail = res[0];
    })
  }

public cancel() {
this.dialogRef.close();
}
}
