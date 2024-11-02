import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { ProfileComponent } from 'src/app/rooms/profile/profile.component';
import { CommunicationService } from 'src/app/rooms/services/communication.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-without-reg',
  templateUrl: './without-reg.component.html',
  styleUrls: ['./without-reg.component.scss']
})
export class WithoutRegComponent {

  withoutLoginForm: FormGroup;
  selected = '';

  constructor(
    private dialogRef: MatDialogRef<WithoutRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private toastr: ToastrService, fb: FormBuilder, private router: Router,
  private authenticationService: AuthenticationService,
  private toastrService: ToastrService) {
    this.withoutLoginForm = fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      gender: ['', [Validators.required]]
    });
  }
  public cancel() {
    this.dialogRef.close();
    }

    login() {
      this.withoutLoginForm.markAsDirty();
      this.withoutLoginForm.markAllAsTouched();
      console.log(this.withoutLoginForm.value);
      if (this.withoutLoginForm.valid) {
        let payload = this.withoutLoginForm.value;
        this.authenticationService.withoutLogin(payload).subscribe((res) => {
          // if (res.status === "ok") {
          //   const decoded: any = jwtDecode(res.data);
            localStorage.setItem("userName", res.userName)
            localStorage.setItem("userId", res._id)
            this.toastrService.success(
              'Logged in successfully!',
              'Success!'
            );
        this.cancel();

            this.router.navigate(['rooms'])
          // }
        }, err => {
          if(err.error === 'User name not available'){
            this.withoutLoginForm.controls['userName'].setErrors({ 'incorrect': true })
            this.toastr.error('User name is not available, please try with another!');
          }else if(err.error){
          this.toastrService.error(err.error);
        
          }else{
            this.toastr.error('Something went wrong!');
          }
        })
      } else {
        this.toastrService.error(
          'Please fill all mandatory fiels!',
          'Error!'
        );
      }
    }

}
