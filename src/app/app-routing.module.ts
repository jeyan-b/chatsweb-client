import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', 
    pathMatch:'full',
    redirectTo:'login' },
    { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'rooms', loadChildren: () => import('./rooms/rooms.module').then(m => m.RoomsModule) }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
