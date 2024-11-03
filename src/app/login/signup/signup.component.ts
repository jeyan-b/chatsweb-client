import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  selected = '';
  passwordVisible = false;

  constructor(private toastr: ToastrService, fb: FormBuilder, private router: Router,private loader: NgxSpinnerService, private authenticationService: AuthenticationService) {
    this.signupForm = fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: [''],
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email]],
      role: ['User', Validators.required],
      gender: ['', Validators.required],
      agree: ['true', Validators.required],
    });
  }
  login() {
    this.router.navigate(['login']);
  }
  checkValue(event: any) {
    if (!event.checked) {
      this.signupForm.controls['agree'].setErrors({ 'required': true })
    } else {
      this.signupForm.controls['agree'].setErrors(null)

    }
    this.signupForm.controls['agree'].markAsTouched();
    this.signupForm.controls['agree'].markAsDirty();
  }
  signup() {
    this.signupForm.markAllAsTouched();
    this.signupForm.markAsDirty();
    if (this.signupForm.value.password.toString() !== this.signupForm.value.confirmPassword.toString()) {
      this.signupForm.controls['confirmPassword'].setErrors({ 'incorrect': true })
    } else {
      this.signupForm.controls['confirmPassword'].clearValidators();
    }

    if (this.signupForm.valid) {
      this.loader.show();
      let payload = this.signupForm.value
      // payload.password = window.btoa(payload.password)
      payload.password = this.encryptData(payload.password);
      this.authenticationService.signup(payload).subscribe((res) => {
      this.loader.hide();
        this.toastr.success('Account has been created successfully', 'Success!');
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2000);
      },
        err => {
      this.loader.hide();
          // console.log(err.error)
          if(err.error === 'User name not available'){
            this.signupForm.controls['userName'].setErrors({ 'incorrect': true })
            this.toastr.error('User name is not available, please try with another!');
          }else{
            this.toastr.error('Something went wrong!');
          }
        })
    } else {
      this.toastr.error('Please fill the all mandatory fields', 'Error!');
    }
  }

  encryptData(value:string){
    const encryptedData = CryptoJS.AES.encrypt(value, environment.loginPasswordKey).toString();
    return encryptedData
  
  }
  
}
