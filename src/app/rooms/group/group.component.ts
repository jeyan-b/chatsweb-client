import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommunicationService } from '../services/communication.service';
import { io } from "socket.io-client";
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {

  // socket = io("http://localhost:8081")
socket = io(environment.socketIoURL, { });
  allGroups : any = [];
  currentUserId:any= "";
  createRoomForm!: FormGroup;
  selectedRoomFromMain:any;
  openedTabs:any

  // @Output() allPublicRoomsEvent = new EventEmitter();

  @Input() users: any;
  // readonly dialog = inject(MatDialog);
  @ViewChild('callAPIDialog') callAPIDialog!: TemplateRef<any>;
  @ViewChild('roomSelectionDialog') roomSelectionDialog!: TemplateRef<any>;
  constructor(private fb: FormBuilder, private dialog: MatDialog, private toastrService: ToastrService, private communicationService: CommunicationService) {
  
  }

  ngOnInit() {
    this.communicationService.selectedRoom.subscribe(res =>{
      this.selectedRoomFromMain =res;
    })
    this.createRoomForm = this.fb.group({
      roomName:  new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
    });
this.getGroups();
//     setInterval(() => {
// this.getGroups();
//     }, 10000);
this.currentUserId = localStorage.getItem('userId');


  }
  // ngAfterViewInit(){
  //   if(!this.communicationService.tabs.length){
  //     if(this.allGroups.length){
  //       this.openRoomSelectionDialog();
  //     }else{
  //       this.openDialog();
  //     }
  //     }
  // }
refreshGroups(res:any){
  let colorArray:any = ['#ffb6b6', '#b4b4ff', '#e9be6f', '#a0e6a0', '#a2eded', '#edbaed', '#d8e579', '#cecccc']
  res.forEach((group:any, index:any) => {
    let randomColor:any
    if(index < 9){
      randomColor = colorArray[index]
    }else{
       randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
    }
  group.bgColor = randomColor
  });
  this.allGroups = res;
  this.communicationService.allGroups = this.allGroups;
}
  allGroupsSetup(res:any){
    // let colorArray:any = ['red', 'blue', 'orange', 'green', 'cyan', 'violet', 'yellow', 'gray']
   this.refreshGroups(res)
    console.log(this.allGroups)
    setTimeout(() => {
      // alert("group component")
      console.log(this.communicationService.tabs);
      // console.log(this.allGroups.length)
      if(!this.communicationService.tabs.length){
        if(this.allGroups.length){
          this.openRoomSelectionDialog();
        }else{
          this.openDialog();
        }
        }
    }, 0);
   
  }

  // createRoom(user:any){
  //   let payload = {
  //     chatName: 'Chennai',
  //     isGroupChat: true,
  //     users : [],
  //     latestMessage: "",
  //     groupAdmin: this.currentUserId
  //   }
  //       this.communicationService.openGroup(payload).subscribe((res)=>{
  //         // console.log(res);           
  //           // this.allGroups =res;
  //           this.allGroupsSetup(res)
  //     // const privateWindow = this.fb.group({
  //     //   privateMessage: "",
  //     //   name: user.userName,
  //     //   id: user._id,
  //     //   gender:user.gender,
  //     //   chatRoomId: res.chatRoom._id
  //     // })
  //     // this.privateWindow.push(privateWindow);
  //     // this.socket.emit('join chat', res.chatRoom._id);

  //       });
  // }

  getGroups(){
    this.communicationService.getAllGroups().subscribe((res:any)=>{
      console.log(res)
      // this.allGroups = res;   
      this.allGroupsSetup(res)


      // this.allPrivateRooms = [];
      // this.users.forEach((user:any) => {
      //   this.socket.emit('setup', user);
      //   this.socket.on("connection", () => {
      //     // this.isthis.socketConnected = true;
      //     console.log("user connecting..."+user);
      //   });
      //   this.checkChatRoom(user)
      // });
    })
  }
  // joinGroup(group:any){
  //   console.log(group)
  // }
  joinGroup(groupFromUI:any){
    // this.communicationService.checkUsers.next(true)
    this.communicationService.getAllGroups().subscribe((res:any)=>{
      console.log(res)  
      // this.allGroupsSetup(res)
this.refreshGroups(res)

this.communicationService.getGroupById(groupFromUI._id).subscribe(groupChatRoom =>{
  this.openedTabs = this.communicationService.tabs
  let group = groupChatRoom.chatRoom
  let filtered =this.allGroups.filter((grp:any) => grp._id === groupFromUI._id)
  group.bgColor = filtered[0].bgColor

  console.log(group)
  // console.log(this.openedTabs)
  // debugger;
  if(this.openedTabs.length == 0){
    this.joinGroupAPICall(group)
  }
  else if(this.openedTabs.length !== 0 && this.openedTabs.length < 3 && (!this.openedTabs.includes(group.chatName))){
      this.joinGroupAPICall(group)
  }else if(this.openedTabs.length !== 0 && this.openedTabs.length < 3 && (this.openedTabs.includes(group.chatName))){
    // this.communicationService.selectedRoom.next(group.chatName);
    let obj = {chatRoom: group, messages: []}
    this.communicationService.allPublicRoomsEvent.next(obj);   
  }else if(this.openedTabs.length === 3 && (this.openedTabs.includes(group.chatName))){
    let obj = {chatRoom: group, messages: []}
    this.communicationService.allPublicRoomsEvent.next(obj); 
  }else{
// alert("Maximum 3 room only allowed, to open another room please close any of one opened room")
this.toastrService.warning(
'Maximum 3 room only allowed, to open another room please close any of one opened room!',
'Warning!'
);
return;
  }
 
})
    })

  }

  joinGroupAPICall(group:any) {
   console.log(group.users)
    localStorage.setItem("activeColor", group.bgColor)
    if(!group.users.includes(this.currentUserId)){
      group.users.push(this.currentUserId);
    }else{
      this.communicationService.selectedRoom.next(group.chatName);
    }
console.log(group.users)
    let payload = {
      chatName: group.chatName,
      isGroupChat: true,
      users : group.users,
      latestMessage: group.latestMessage,
      groupAdmin: group.groupAdmin
    }
        this.communicationService.joinGroupById( group._id, payload).subscribe((res)=>{
          console.log(res);   
          console.log(this.allGroups);  
          let filtered = this.allGroups.filter((individualGrp:any) => individualGrp._id === res.chatRoom._id)
          if(filtered.length){
            let obj = {chatRoom: filtered[0], messages: []}
            this.communicationService.allPublicRoomsEvent.next(obj);      

          }else{
            this.communicationService.allPublicRoomsEvent.next(res);      
          } 
          // this.allPublicRoomsFromChild.emit(res);  
            // this.allPublicRooms.push(res);
      // const privateWindow = this.fb.group({
      //   privateMessage: "",
      //   name: user.userName,
      //   id: user._id,
      //   gender:user.gender,
      //   chatRoomId: res.chatRoom._id
      // })
      // this.privateWindow.push(privateWindow);
      this.socket.emit('join chat', res.chatRoom._id);

        });
  }
  saveRoomName(){
    if(this.createRoomForm.valid){

      console.log(this.createRoomForm.value.roomName);
      console.log(this.allGroups);
    let filtered =this.allGroups.filter((grp:any) => grp.chatName.toLowerCase() === this.createRoomForm.value.roomName.toLowerCase())

      if(!filtered.length){

      
      let payload = {
        chatName: this.createRoomForm.value.roomName,
        isGroupChat: true,
        users : [this.currentUserId],
        latestMessage: "",
        groupAdmin: this.currentUserId
      }
          this.communicationService.openGroup(payload).subscribe((res)=>{          
              // this.allGroups =res;    
          // this.allGroupsSetup(res)
          this.dialog.closeAll();
          this.toastrService.success(
            'Room created successfully!',
            'Success!'
          );
          this.createRoomForm.reset();
          this.getGroups();

          });
        }else{
      this.createRoomForm.controls['roomName'].setErrors({ 'incorrect': true })

          this.toastrService.error(
            'Entered room name already exist',
            'Error!'
          );
        }

    }else{
      this.toastrService.error(
        'Please enter room name!',
        'Error!'
      );
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.createRoomForm.reset();
      // console.log(`Dialog result: ${result}`);
      // if(result){
      
    
      // }
    });
  }
  openRoomSelectionDialog() {
    const dialogRef = this.dialog.open(this.roomSelectionDialog,  { disableClose: true });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
  
      }
    });
  }
}
