import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginRoutingModule } from './login-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { WithoutRegComponent } from './without-reg/without-reg.component';
// import {provideNativeDateAdapter} from '@angular/material/core';
// import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    WithoutRegComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    MatFormFieldModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    // ToastrModule.forRoot()
  ],
  providers:[
    AuthenticationService,
    // provideNativeDateAdapter()
  ]
})
export class LoginModule { }
