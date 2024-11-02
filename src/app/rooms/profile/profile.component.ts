import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from '../services/communication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userDetail:any;
  profileForm: FormGroup;
  selected = '';

  constructor(
    private dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private communicationService: CommunicationService,
  private toastr: ToastrService, fb: FormBuilder, private router: Router) {

    this.profileForm = fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: [''],
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email]],
      gender: ['', Validators.required]
    });
  }

    ngOnInit(){
      console.log(this.data.userId)
      this.communicationService.userDataById(this.data.userId).subscribe(res =>{
        console.log(res)
        this.userDetail = res[0];
        this.profileForm.patchValue(this.userDetail);
      })
    }

public cancel() {
this.dialogRef.close();
}
update() {
  this.profileForm.markAllAsTouched();
  this.profileForm.markAsDirty();
  console.log(this.profileForm)
  if (this.profileForm.valid) {
    let payload = this.profileForm.value
    // payload.password = window.btoa(payload.password)
    // payload.password = this.encryptData(payload.password);
    this.communicationService.updateUserDataById(this.data.userId, payload).subscribe((res) => {
      this.toastr.success('Account has been updated successfully', 'Success!');
      setTimeout(() => {
        // this.router.navigate(['login']);
        window.location.reload()
      }, 2000);
    },
      err => {
        this.toastr.error('Something went wrong!');
      })
  } else {
    this.toastr.error('Please fill the all mandatory fields', 'Error!');
  }
}

}
