import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { PrivateComponent } from './private/private.component';
import { RoomsRoutingModule } from './rooms-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunicationService } from './services/communication.service';
import { HttpClientModule } from '@angular/common/http';
import { MyFilterPipe } from '../getChatMessage.pipe';
import { RoomsComponent } from './rooms.component';
import { GroupComponent } from './group/group.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserNameFilterPipe } from '../getUserName.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {OverlayModule} from '@angular/cdk/overlay';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    MainComponent,
    PrivateComponent,
    MyFilterPipe,
    RoomsComponent,
    GroupComponent,
    UserNameFilterPipe,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RoomsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule, MatButtonModule,
    MatMenuModule,
    PickerModule
    
  ],
  providers: [CommunicationService]
})
export class RoomsModule { }
