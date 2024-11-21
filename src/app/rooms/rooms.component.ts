import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { io } from "socket.io-client";
// import { socketService } from '../socket.service';
import { CommunicationService } from './services/communication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from './profile/profile.component';
import { environment } from 'src/environments/environment';

// const socket = io("http://localhost:8081");
// @HostListener('window:beforeunload')
@HostListener('window:beforeunload')
@HostListener('document:visibilitychange', ['$event'])
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent  implements OnInit, OnDestroy {
  users:any = []
  roomSpecificUsers:any = []
  // socket = io("http://localhost:8081")
socket = io(environment.socketIoURL, { });
  privateMsgs:any = []
  privateChatForm: FormGroup;
  copyrightYear: any;
  // publicChatForm: FormGroup;
  currentUserName:any= "";
  currentUserId:any= "";
  currentUser:any= "";
  // isthis.socketConnected = false;
  allMessages:any= [];
  allPrivateRooms:any= [];
  // allPublicGroups:any= [];
  isOpen = false;
  activeColor:any  
message = '';
showEmojiPicker = false;
sets = [
  'native',
  'google',
  'twitter',
  'facebook',
  'emojione',
  'apple',
  'messenger'
]
set:any = 'native';
base64textStringPrivate:any = [];
fileName:any;
activeRoom:any;
allGroups: any;
counter= 30

  constructor(private toastr: ToastrService, private dialog: MatDialog, private fb: FormBuilder, private router:Router, private communicationService: CommunicationService) {
    this.privateChatForm = this.fb.group({
      privateChatInputs: this.fb.array([])
    });
    // this.publicChatForm = this.fb.group({
    //   publicChatInputs: this.fb.array([])
    // });
    this.copyrightYear= new Date().getFullYear()
  }
  ngOnInit() {
    this.communicationService.tabs = [];
  this.communicationService.selectedRoom.subscribe(res =>{
    console.log(res)
    this.activeRoom = res;
    // let allGroups = this.communicationService.allGroups
    // let selectedGroup:any = allGroups.filter((room:any) => room.chatRoom.chatName?.toString() === res?.toString());
    // this.communicationService.getGroupById(selectedGroup[0]?.chatRoom?._id).subscribe(groupChatRoom =>{
    //   // this.openedTabs = this.communicationService.tabs
    //   // let users = groupChatRoom.chatRoom.users

    // });
    console.log(this.communicationService.roomSpecificUsers)
    this.activeColor = localStorage.getItem('activeColor')
    this.roomSpecificUsers= [];
    if(this.communicationService.roomSpecificUsers.length){
      let userIsAvailable = true
      this.users.forEach((us:any) => {
        // let userId:any = ;
        let commServRoomSpecUsers:any = this.communicationService.roomSpecificUsers
        if(commServRoomSpecUsers.includes(us._id?.toString())){
          this.roomSpecificUsers.push(us)
        }else{
         userIsAvailable = false;
        }
        
      });
      if(!userIsAvailable){
        // this.communicationService.usersLoader.next(true);
        this.communicationService.getAllUsers().subscribe((res1)=>{
          // console.log(res)
        // this.communicationService.usersLoader.next(false);

        let activeUsers = res1.filter((user:any) => user.isLoggedIn === true);
        
          this.users = activeUsers; 
          this.communicationService.users =  activeUsers;
          this.roomSpecificUsers= [];
          this.users.forEach((us:any) => {
            // let userId:any = ;
            let commServRoomSpecUsers:any = this.communicationService.roomSpecificUsers
            console.log(commServRoomSpecUsers)
            if(commServRoomSpecUsers.includes(us._id?.toString())){
              this.roomSpecificUsers.push(us)
            }
            
          });
        
                  })
      }


//       this.communicationService.roomSpecificUsers.forEach((userId:any) => {
//       this.users.forEach((us:any) => {
//         if(us._id.toString() === userId.toString()){
// this.roomSpecificUsers.push(us)
//         }
        
//       });
//     });

// let checkUsers = this.communicationService.roomSpecificUsers.filter((user:any) => user.isLoggedIn === true);

// this.communicationService.getAllUsers().subscribe((res1)=>{
//   // console.log(res)
// let activeUsers = res1.filter((user:any) => user.isLoggedIn === true);

//   this.users = activeUsers; 
//   this.communicationService.users =  activeUsers

// })
    }
  });

    // this.socket.on("user joined", (userJoinedRoom) => {
    //   // alert('user joined');
    //   console.log(userJoinedRoom)
    //   console.log(this.users);
    //   // let selectedGroup =  res.filter((room:any) => room.chatRoom.chatName.toString() === this.activeRoom?.toString());
    //   // this.communicationService.roomSpecificUsers = selectedGroup[0].chatRoom.users
      
    //   // this.communicationService.getGroupById(selectedGroup[0].chatRoom._id).subscribe(room =>{
    //   //   this.communicationService.roomSpecificUsers = room.chatRoom.users
    //   // });

    // //   let selectedUser = this.users.filter((user:any) => user._id.toString() === userJoinedRoom?.toString());
    // //  console.log(selectedUser)
    // //   if(!selectedUser.length){
    // //     this.getAllUsers();
    // //     // this.communicationService.selectedRoom.next(true)
    // // this.communicationService.usersLoader.next(true);
    // this.communicationService.getAllUsers().subscribe((res1)=>{
    //   // this.communicationService.usersLoader.next(false);

    //   // console.log(res)
    // let activeUsers = res1.filter((user:any) => user.isLoggedIn === true);

    //   this.users = activeUsers; 
    //   this.communicationService.users =  activeUsers;


    //     this.communicationService.getAllGroups().subscribe((res:any)=>{
    //       console.log(res)
    //       let selectedGroup =  res.filter((room:any) => room.chatName.toString() === this.activeRoom?.toString());
    //       // this.communicationService.roomSpecificUsers = selectedGroup[0].chatRoom.users
    //       if(selectedGroup.length){

    //       this.communicationService.getGroupById(selectedGroup[0]._id).subscribe(room =>{
    //         console.log(this.roomSpecificUsers);
    //         console.log(room)
    //         console.log(this.users)
    //         console.log(room.chatRoom.users)
    //         this.roomSpecificUsers =[];
    //         this.users.forEach((us:any) => {
    //         if(room.chatRoom.users.includes(us._id?.toString())){
    //           this.roomSpecificUsers.push(us)
    //         }
    //       })
    //       this.communicationService.roomSpecificUsers = this.roomSpecificUsers;
    //       console.log(this.roomSpecificUsers);

    //       let newlyJoinedUser = this.users.filter((user:any) => user._id.toString() === userJoinedRoom?.toString());


    //       // this.users.forEach((user:any) => {
    //         console.log(newlyJoinedUser[0]._id +"=== "+userJoinedRoom)
    //         // if(user._id === this.currentUserId){
    //         //   this.currentUser = user;
    //         // }else{
              
    //         // }
    //         this.checkChatRoom(newlyJoinedUser[0])
    //         // this.socket.emit('setup', newlyJoinedUser[0]);
    //         this.socket.on("connection", () => {
    //           // this.isthis.socketConnected = true;
    //           console.log("user connecting..."+newlyJoinedUser[0]);
    //         });
    //       // });

        
    //   //       room.chatRoom.users.forEach((userId:any) => {
    //   // let userIsAvailable = false
    //   //         this.users.forEach((us:any) => {
    //   //           // let userId:any = ;

    //   //           if(us._id === userId){
    //   //  userIsAvailable = true


    //   //           }else{
    //   //  userIsAvailable = false

    //   //           }
    //   //           let commServRoomSpecUsers:any = this.communicationService.roomSpecificUsers
    //   //           if(commServRoomSpecUsers.includes(us._id?.toString())){
    //   //             this.roomSpecificUsers.push(us)
    //   //           }else{
    //   //            userIsAvailable = false;
    //   //           }
                
    //   //         });
    //   //       });
      

    //         // this.communicationService.roomSpecificUsers = room.chatRoom.users
    //         // this.roomSpecificUsers = room.chatRoom.users
    //       });
    //     }

    //     })
    //   })
    // //   }else{
    // //    let isRoomSpecificUsersContains= this.roomSpecificUsers.filter((user:any) => user._id.toString() === selectedUser[0]._id?.toString());
    // //     if(!isRoomSpecificUsersContains.length){
    // //       this.roomSpecificUsers.push(selectedUser[0])
    // //     }
    //   // }

    //   // this.getAllUsers();
    // })
    // this.socket.on("connected", (userJoinedRoom) => {
    //   alert('connected');
    //   console.log(userJoinedRoom)
    // })
    this.socket.on("message received", (newMessageReceived) => {
    // this.communicationService.checkUsers.next(true)
      // this.getAllUsers();
      // this.communicationService.getAllUsers().subscribe((res1)=>{
      //   // console.log(res)
      // let activeUsers = res1.filter((user:any) => user.isLoggedIn === true);

      //   this.users = activeUsers; 
      //   this.communicationService.users =  activeUsers

   
      console.log(newMessageReceived); // x8WIv7-mJelg7on_ALbx
      console.log(this.allPrivateRooms);

      let selectedUser = this.users.filter((user:any) => user._id.toString() === newMessageReceived.sender?.toString());
      let selectedUserRoomSpecific = this.roomSpecificUsers.filter((user:any) => user._id.toString() === newMessageReceived.sender?.toString());
     console.log(selectedUser)
     console.log(selectedUserRoomSpecific)

     if(selectedUser.length === 0){    
      // this.communicationService.usersLoader.next(true);
      
      this.communicationService.getAllUsers().subscribe((res1)=>{
        // console.log(res)
        // this.communicationService.usersLoader.next(false);

      let activeUsers = res1.filter((user:any) => user.isLoggedIn === true);

        this.users = activeUsers; 
        this.communicationService.users =  activeUsers;
        let selectedUserAgainCheck = this.users.filter((user:any) => user._id.toString() === newMessageReceived.sender?.toString());
        console.log(selectedUserAgainCheck);
        if(selectedUserAgainCheck.length){
      let selectedUserRoomSpecificDuplicateCheck = this.roomSpecificUsers.filter((user:any) => user._id.toString() === selectedUserAgainCheck[0]._id?.toString());
if(!selectedUserRoomSpecificDuplicateCheck.length){
  this.roomSpecificUsers.push(selectedUserAgainCheck[0]);

}
this.progressNewMessage(newMessageReceived);
        }    
      })
   
    }else if(selectedUser.length && (!selectedUserRoomSpecific.length)){
      console.log(selectedUser);
      this.roomSpecificUsers.push(selectedUser[0]);
      this.progressNewMessage(newMessageReceived)
    }else{
      this.progressNewMessage(newMessageReceived);
    }         
    });
  // });
  this.getGroups();
  this.currentUserName = localStorage.getItem('userName')
  this.currentUserId = localStorage.getItem('userId')
  // this.this.socketService.listen("message received").subscribe((newMessageReceived)=>{
  //   // console.log(newMessageReceived);
  // })
  this.communicationService.checkUsers.subscribe(res =>{
  this.getAllUsers();
  })
  this.counter = 30;
  setInterval(() => {
    this.counter -= 1
    if(this.counter === 0){
      this.getGroups();
      this.counter = 30;
    }
  }, 1000);
  }

  progressNewMessage(newMessageReceived:any){
    console.log("progressNewMessage---")
    let type ="";
    if(newMessageReceived.sender?.toString() === localStorage.getItem('userId')?.toString()){
      type = "sent"
    }else{
      type = "received"            
    }
    newMessageReceived.type =  type;
    let name="";
    
    this.users.forEach((user:any) => {
      if(user._id.toString() === newMessageReceived.sender?.toString()){
        // name = user.userName
        if(user.firstName === 'unknown'){
          name = user.userName
        }else{
          name= user.firstName + " "+ user.lastName
        }
      }});
      newMessageReceived.name =  name;
    if(newMessageReceived.isGroupChat){

this.communicationService.groupChatMessage.next(newMessageReceived);
    }else{
      if(this.allMessages.length){
        this.allMessages.forEach((element:any) => {
          if(element.chat.toString() === newMessageReceived.chat.toString()){
            element.messages.push(newMessageReceived)
          }else{
            let obj = {chat:newMessageReceived.chat, messages:[newMessageReceived]}
        this.allMessages.push(obj);
        // console.log(this.privateWindow.controls)
          }     
        });
      }else{
        let obj = {chat:newMessageReceived.chat, messages:[newMessageReceived]}
        this.allMessages.push(obj)
      } 
      if(this.privateWindow.controls.length){
        let isRoomOpened = this.privateWindow.controls.filter((control:any) => control?.controls['chatRoomId'].value.toString() === newMessageReceived.chat.toString());
        console.log(isRoomOpened)
        // alert(type)
        // alert(isRoomOpened.length)
        if(!isRoomOpened.length){
        // if(!isRoomOpened.length){
          if(type === "received"){
            this.openNewPrivateChatWindow(newMessageReceived, 'highlight');
          }else{
            this.openNewPrivateChatWindow(newMessageReceived);
          }
        }else{
          setTimeout(() => {
            (document.getElementById('private-window'+newMessageReceived.chat) as HTMLDivElement).classList.add("highlight-box")
          }, 0); 
        }
      }else{
        if(type === "received"){
          this.openNewPrivateChatWindow(newMessageReceived, 'highlight');
        }else{
          this.openNewPrivateChatWindow(newMessageReceived);
        }
      }
    }

  } 
  
  openNewPrivateChatWindow(newMessageReceived:any, highlight?:string)
  {
    console.log(this.allPrivateRooms)
    console.log(newMessageReceived)
    // let selectedUserId:any = null;
    // this.allPrivateRooms.forEach((room:any) => {
    //   if(room.chatRoom._id === newMessageReceived.chat){
    //     room.chatRoom.users.forEach((userId:any) => {
    //       if(userId !== this.currentUserId){
    //         selectedUserId = userId;
    //       }              
    //     });
    //   }
    // });
   let selectedOne = newMessageReceived.users.filter((userId:any) => userId === newMessageReceived.sender);
    let selectedUserId= selectedOne[0]
    console.log("selectedUserId=== " + selectedUserId);
    console.log(this.users)
   let selectedUser = this.users.filter((user:any) => user._id === selectedUserId);
   console.log(selectedUser)
   let user = selectedUser[0];
   console.log(this.privateWindow);
   if(user){
    let name:any;
    if(user.firstName === 'unknown'){
      name = user.userName
    }else{
      name= user.firstName + " "+ user.lastName
    }
    const newPrivateWindow = this.fb.group({
      privateMessage: "",
      name: name,
      id: user._id,
      gender:user.gender,
      chatRoomId: newMessageReceived.chat,
      emoji: false
    })
    this.privateWindow.push(newPrivateWindow);
    setTimeout(() => {
      (document.getElementById('private-window'+newMessageReceived.chat) as HTMLDivElement).classList.add("highlight-box")
    }, 0); 
   }else{
    // alert('User not available');
    //  this.getAllUsers();
    // this.progressNewMessage(newMessageReceived)

    //  this.getAllUsers();
    // const newPrivateWindow = this.fb.group({
    //   privateMessage: "",
    //   name: user.userName,
    //   id: user._id,
    //   gender:user.gender,
    //   chatRoomId: newMessageReceived.chat,
    //   emoji: false
    // })
    // this.privateWindow.push(newPrivateWindow);
    // setTimeout(() => {
    //   (document.getElementById('private-window'+newMessageReceived.chat) as HTMLDivElement).classList.add("highlight-box")
    // }, 0); 
   }

  }
  get privateWindow() {
    return this.privateChatForm.get('privateChatInputs') as FormArray
  }
  // get publicWindow() {
  //   return this.publicChatForm.get('publicChatInputs') as FormArray
  // }
    openMenu(name:string){
      // // console.log("open: "+name);
      (document.getElementById(name) as HTMLElement).style.display = 'block';
  
    }
    hideMenu(name: string){
      // // console.log("close: "+name);
      (document.getElementById(name) as HTMLElement).style.display = 'none';
  
    }
    openPrivate(user:any){

      // this.socket.emit('setup', user);
      // this.socket.on("connection", () => {
      //   this.isthis.socketConnected = true;
      // });
  
      let focusedDoms:any = document.querySelectorAll(".focused")
      focusedDoms.forEach((dom:any) => {
        dom?.classList.remove("focused");      
      });
  
  
      if(this.privateWindow.controls.length >0){
        if(this.privateWindow.controls.find((e:any) => e.value.id === user._id)){
          let dom = document.getElementById("private-window"+user._id);
          dom?.classList.add("focused");
        }else{
          this.openPrivateChatRoom(user)
        }
      }else{
        this.openPrivateChatRoom(user)
      }
      // console.log(this.privateWindow);
  
  
  
    }

    openPrivateChatRoom(user:any){
      console.log(user);
      console.log(this.allPrivateRooms);
      let chatRoomId = null;
      this.allPrivateRooms.forEach((room:any) => {
        if(room.chatRoom.users.includes(user._id)){
          chatRoomId = room.chatRoom._id
        }
        
      });
      let name:any;
      if(user.firstName === 'unknown'){
        name = user.userName
      }else{
        name= user.firstName + " "+ user.lastName
      }

   const newPrivateWindow = this.fb.group({
          privateMessage: "",
          name: name,
          id: user._id,
          gender:user.gender,
          chatRoomId: chatRoomId,
          emoji: false
        })
        this.privateWindow.push(newPrivateWindow);
        console.log(this.privateWindow);
    }

 
  
    checkChatRoom(user:any){
      let payload = {
        chatName: 'individual',
        isGroupChat: false,
        users : [user._id, this.currentUserId],
        latestMessage: "",
        groupAdmin: this.currentUserId
      }
          this.communicationService.openChat(payload).subscribe((res)=>{
            // console.log(res);           
              this.allPrivateRooms.push(res);
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
    // getPrivateMessageFromServer(){
    //   this.communicationService.getPrivateMessage(payload).subscribe((res)=>{
    //     // console.log(res);  
    //     // this.privateMsgs =res; 
    //     res.forEach((element:any) => {
    //       let toUser = this.privateMsgs.find((e:any) => e.toId === element.toId);
    //       if(toUser){
    //         toUser.messages = res;
    //         // toUser.type = type;
    //       }else{
    //         let obj = {
    //           toId:element.toId,
    //           messages : res,
    //           // type: type
    //         }
    //         this.privateMsgs.push(obj)
    //         // this.getPrivateMsgsById(this.privateChatForm.value.privateChatInputs[i].id)
  
    //       }
    //     }); 
       
        
    //   })
    // }
  
    closePrivateWindow(window:any, index:any){
      console.log(window)
      console.log(this.allMessages)
      // console.log(window.value.chatRoomId)
      // this.socket.emit('close chat', window.value.chatRoomId);
      this.allMessages.forEach((roomsMsg:any) => {
        if(roomsMsg.chat.toString() === window.value.chatRoomId.toString()){
          roomsMsg.messages =[];
        }        
      });
      this.privateWindow.removeAt(index);
  // let obj ={ roomId:  window.value.chatRoomId, userId: this.currentUserId}
  // this.socket.emit('close chat', obj);  
    }
  
    sendPrivateMsg(i:any, chatRoomValue:any){
      console.log(chatRoomValue)
      console.log(this.privateChatForm.value.privateChatInputs[i]);
      // console.log(this.privateChatForm);
      let content:any;
      if(this.base64textStringPrivate.length){
        content = this.base64textStringPrivate[0]
      }else{
        content =this.privateChatForm.value.privateChatInputs[i].privateMessage
      }

      if(content !==""){

      const payload = {
        sender: localStorage.getItem("userId"),
        chat:this.privateChatForm.value.privateChatInputs[i].chatRoomId,
        content: content
      }
      this.communicationService.savePrivateMessage(payload).subscribe((res)=>{
        // console.log(res);  
        // this.privateChatForm.value.privateChatInputs[i].privateMessage
        this.privateWindow.controls[i].get('privateMessage')?.setValue('')
        // this.socket.emit('output', res);
        this.privateMsgs[i] =res; 
        this.getPrivateMsgsById(this.privateChatForm.value.privateChatInputs[i], i);
  
        let newMessageAndRoom = res.messages[res.messages.length-1]
        newMessageAndRoom.users = res.chatRoom.users
        newMessageAndRoom.isGroupChat = false
        // newMessageAndRoom.chat = res.chatRoom._id
        // newMessageAndRoom.sender = res.messages[res.messages.length-1].sender  
        console.log('emitting new mesage---'+ newMessageAndRoom)    
        this.socket.emit("new message", newMessageAndRoom);
        console.log('emitted')    

        let lastMessage = res.messages[res.messages.length-1];
        // lastMessage.name= this.currentUserName;
      let currUserDet = this.users.filter((user:any) => user._id === this.currentUserId);

        let name:any;
        if(currUserDet[0].firstName === 'unknown'){
          name = currUserDet[0].userName
        }else{
          name= currUserDet[0].firstName + " "+ currUserDet[0].lastName
        }
        lastMessage.name= name;
        // alert(this.currentUserName)
        if(this.allMessages.length){
          this.allMessages.forEach((element:any) => {
            if(element.chat.toString() === lastMessage.chat.toString()){
              element.messages.push(lastMessage)
            }else{
              let obj = {chat:lastMessage.chat, messages:[lastMessage]}
          this.allMessages.push(obj)
            }     
          });
        }else{
          let obj = {chat:lastMessage.chat, messages:[lastMessage]}
          this.allMessages.push(obj)
        } 
  console.log(this.allMessages)
  // var objDiv:any = document.getElementById("box-body");
  setTimeout(() => {
    let objDiv = document.getElementById("box-body"+i) as HTMLDivElement;
    objDiv.scrollTo(0, objDiv.scrollHeight+20);
  }, 0);
 
        // res.forEach((element:any) => {
        //   let toUser = this.privateMsgs.find((e:any) => e.toId === element.toId);
        //   if(toUser){
        //     toUser.messages = res;
        //     // toUser.type = type;
        //   }else{
        //     let obj = {
        //       toId:element.toId,
        //       messages : res,
        //       // type: type
        //     }
        //     this.privateMsgs.push(obj)
        //     // this.getPrivateMsgsById(this.privateChatForm.value.privateChatInputs[i].id)
  
        //   }
        // }); 
       
        
      });
      this.removeSelectedImagePrivate(i)
    }
  
    }
    getPrivateMsgsById(formValue:any, index:any){
      // // console.log(id)
      // console.log(this.privateMsgs, index)
      if(this.privateMsgs.length){
        let filteredMsgs = this.privateMsgs[index]?.messages;
        // // console.log(filteredMsgs[0]?.messages);
        filteredMsgs.forEach((element:any) => {
          let type ="";
          // // console.log(element.fromId?.toString() +"=== "+localStorage.getItem('userId')?.toString())
          if(element.sender?.toString() === localStorage.getItem('userId')?.toString()){
            type = "sent"
          }else{
            type = "received"            
          }
          element.type =  type;
        });
      // return filteredMsgs;
      // console.log(this.privateMsgs)
      // console.log(filteredMsgs)
      }
      // let filteredMsgs = this.privateMsgs.filter((e:any) => e.toId.toString() === id.toString());
  
      // // console.log(filteredMsgs[0]?.messages)
    }
    // renderMessages(window:any, index:any){
    //   // // console.log(this.privateMsgs, index)
    //   // console.log(window)
    //   let formValue = window.value;
    //   // console.log(formValue)
    //   if(this.allMessages.length){
    //     let filteredMsgs:any = [];
    //     this.allMessages.forEach((element:any) => {
    //       if(element.chat.toString() === formValue.chatRoomId.toString()){
    //         filteredMsgs.push(element)
    //       }     
    //     });
    //     console.log(filteredMsgs[0]?.messages)
    //   return filteredMsgs[0]?.messages;
    //   }
    // }


    getAllUsers(){
      // this.communicationService.usersLoader.next(true);
      this.communicationService.getAllUsers().subscribe((res1)=>{
        console.log(res1)
        // this.communicationService.usersLoader.next(false);
      let activeUsers = res1.filter((user:any) => user.isLoggedIn === true);

        this.users = activeUsers; 
        this.communicationService.users =  activeUsers
        this.allPrivateRooms = [];
        this.users.forEach((user:any) => {
          console.log(user._id +"=== "+this.currentUserId)
          if(user._id === this.currentUserId){
            this.currentUser = user;
          }else{
            this.checkChatRoom(user)
          }
          this.socket.emit('setup', user);
          this.socket.on("connection", () => {
            // this.isthis.socketConnected = true;
            console.log("user connecting..."+user);
          });
      let selectedUserRoomSpecific = this.roomSpecificUsers.filter((user1:any) => user1._id.toString() === user._id?.toString());
          if(!selectedUserRoomSpecific.length){
            this.roomSpecificUsers.push(user)
          }
        });
      })
    }
    logout(){

      let allGroups = this.communicationService.allGroups
      allGroups.forEach((grp:any) => {
  // this.socket.emit('close chat', grp._id);
  let obj ={ roomId:  grp._id, userId: this.currentUserId}
  this.socket.emit('close chat', obj);
  
    // this.socket.disconnect()
    // this.socket.off("setup", () => {
    //   // this.isthis.socketConnected = true;
    //   console.log("user disconnecting..."+this.currentUserId);
    // });
        
      });

      let deletableUser = this.users.filter((user:any) => user._id.toString() === this.currentUserId?.toString());
      console.log(deletableUser[0])
      if(deletableUser[0].role === 'Guest'){
        this.communicationService.deleteUser(this.currentUserId).subscribe((res)=>{
          this.toastr.success('Logged out successfully', 'Success!');
        })
      }else{
        let payload = {
          userId: this.currentUserId,
          isLoggedIn: false,
        }
            this.communicationService.logout(payload).subscribe((res)=>{
              this.toastr.success('Logged out successfully', 'Success!');
            }
          )
      }

      localStorage.clear();

    this.router.navigate(['login']);
 


    }

    toggleEmojiPicker(event:any, index:any) {
      event.stopPropagation();
      // console.log(index)
      // console.log(this.privateWindow.controls);
      // console.log(this.privateWindow.controls[index]);
      // console.log(this.privateWindow.controls[index].get('emoji'));
      if(this.privateWindow.controls[index].get('emoji')?.value){
        this.privateWindow.controls[index].get('emoji')?.setValue(false)
      }else{
        this.privateWindow.controls[index].get('emoji')?.setValue(true)
      }
          // this.showEmojiPicker = !this.showEmojiPicker;
    }
  
    addEmoji(event:any, index:any) {
  var curPos:any =   (document.getElementById("privateChatInput"+index) as HTMLInputElement).selectionStart; 
  // let x = this.privateChatForm.controls['privateMessage']?.value; 
  let x = this.privateChatForm.value.privateChatInputs[index].privateMessage; 
  let text_to_insert = event.emoji.native; 
  this.privateWindow.controls[index].get('privateMessage')?.setValue(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
  // this.privateChatForm.controls['privateMessage'].setValue(x.slice(0, curPos) + text_to_insert + x.slice(curPos)); 
      // let updatedMsg = this.mainForm.controls['selectedTabMessage'].value + event.emoji.native;
      // this.mainForm.controls['selectedTabMessage'].setValue(updatedMsg)
      // this.showEmojiPicker = false;
    }
  
    onFocus() {
      console.log('focus');
      this.showEmojiPicker = false;
    }
    onBlur() {
      console.log('onblur')
    }
  
    onUploadChangePrivate(evt: any) {
      console.log(evt)
      const file = evt.target.files[0];
      this.fileName = file.name;
      if (file && file.size < 500001) {
        const reader = new FileReader();
    
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }else{
        alert("Allowed max size is 500kb")
      }
    evt.target.value = ''
    }
    
    handleReaderLoaded(e:any) {
      console.log(e)
  
      // this.base64textStringPrivate.push('data:image/png;base64,' + btoa(e.target.result));
      this.base64textStringPrivate =['data:image/png;base64,' + btoa(e.target.result)];
      console.log(this.base64textStringPrivate)
    }
    removeSelectedImagePrivate(ind:any){
      this.base64textStringPrivate=[];
      this.fileName="";
    }

    adjustIndex(divId:any, event:any){
      event.stopPropagation()
      let allBoxes:any = document.querySelectorAll(".example-box");
      for (let item of allBoxes) {
        item.style.zIndex = "2";
        if(item.classList.contains("highlight-box")){
          item.classList.remove("highlight-box")
        }
    }
    (document.getElementById(divId) as HTMLDivElement).style.zIndex = "3"
    }

    async ngOnDestroy() {
      // alert("ngOnDestroy")
      // localStorage.clear();

      // this.router.navigate(['login'])
   
      let allGroups = this.communicationService.allGroups
      await allGroups.forEach((grp:any) => {
        
  // this.socket.emit('close chat', grp._id);
  let obj ={ roomId:  grp._id, userId: this.currentUserId}
  this.socket.emit('close chat', obj);
    
      // const userId = this.authenticationService.user?.profile?.sub; // get user id
      // await this.userService.closeConnection(userId).toPromise(); // sign out user
      
    }
  )
  let payload = {
    userId: this.currentUserId,
    isLoggedIn: false,
  }
  await this.communicationService.logout(payload).subscribe();
}
beforeUnloadHandler(event:any) {
  alert("1")
  event.preventDefault();
  return false;   
 }
 unloadHandler(event:any) {
  alert("2")

   // ...
 }
 visibilitychange() {
  this.checkHiddenDocument().then(() => {});
}

async checkHiddenDocument() {
  if (document.visibilityState === 'hidden') {
   alert("77")
  } else {
    // add logic
  }
}

addMention(user:any){
console.log(user)
}

profileClick(currentUser:any){
  const dialogRef = this.dialog.open(ProfileComponent, {
    width: '750px',
    height: '550px',
    data: {
      userId: currentUser._id
    }
  });
}

getGroups(){
  // this.communicationService.groupsLoader.next(true);

  this.communicationService.getAllGroups().subscribe((res:any)=>{
    console.log(res)   
    this.allGroups = res;
    this.communicationService.roomsRefresh.next(res);
    this.getAllUsers();
  })
}
}
