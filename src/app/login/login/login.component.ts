import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { jwtDecode } from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { WithoutRegComponent } from '../without-reg/without-reg.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordVisible = false;

  constructor(fb: FormBuilder, private router: Router, private dialog: MatDialog, private loader: NgxSpinnerService, private toastrService: ToastrService, private authenticationService: AuthenticationService) {
    this.loginForm = fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    });
  }

  ngOnInit(){
    if(localStorage.getItem('userId')){
    this.router.navigate(['rooms'])
    }
  }
encryptData(value:string){
  const encryptedData = CryptoJS.AES.encrypt(value, environment.loginPasswordKey).toString();
  return encryptedData

}
  login() {
    this.loginForm.markAsDirty();
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loader.show();
      let payload = this.loginForm.value;
      payload.password = this.encryptData(payload.password)
      this.authenticationService.login(payload).subscribe((res) => {
      this.loader.hide();
        if (res.status === "ok") {
          const decoded: any = jwtDecode(res.data);
          localStorage.setItem("userName", decoded.userName)
          localStorage.setItem("userId", decoded.id)
          this.toastrService.success(
            'Logged in successfully!',
            'Success!'
          );
          this.router.navigate(['rooms'])
        }
      }, err => {
      this.loader.hide();
        this.toastrService.error(err.error);
      })
    } else {
      this.toastrService.error(
        'Please fill all mandatory fiels!',
        'Error!'
      );
    }
  }

  signup() {
    this.router.navigate(['signup'])

  }

  loginWithoutReg(){
    const dialogRef = this.dialog.open(WithoutRegComponent, {
      width: '100vw',
      height: '100vh',
      panelClass: 'withoutRegComponent-dialog',
    });
  }

}
