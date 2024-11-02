import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PrivateComponent } from './private/private.component';
import { RoomsComponent } from './rooms.component';
// import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  
    { path: '', component: RoomsComponent },
    // { path: 'profile', component: ProfileComponent },
    // {path: 'private', component: PrivateComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
