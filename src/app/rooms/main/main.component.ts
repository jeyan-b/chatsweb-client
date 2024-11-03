import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CommunicationService } from '../services/communication.service';
import { SocketService } from 'src/app/socket.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Input() socket: any;
 
//   users:any = []

// privateMsgs:any = []
mainForm: FormGroup;
// currentUserName:any= "";
// currentUserId:any= "";
// isSocketConnected = false;
allMainMessages:any= [];
allPublicRooms: any = [];
// tabs = ['First', 'Second', 'Third'];
tabs:any = [];
selected = new FormControl(0);
currentUserId: any;
@Input() users: any;

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
base64textString:any = [];
fileName:any;
activeColor:any


constructor(private socketService: SocketService, private fb: FormBuilder, private communicationService: CommunicationService) {
  this.mainForm = this.fb.group({
    selectedTabName:  new FormControl(''),
    selectedTabId:  new FormControl(''),
    selectedTabMessage:  new FormControl('')
  });
}
ngOnInit() {

  this.currentUserId = localStorage.getItem('userId')

  // this.socket.emit('main setup', this.currentUserId);
  // this.socket.on("connection", () => {
  //   // this.isthis.socketConnected = true;
  //   console.log("user main connecting..."+this.currentUserId);
  // });

  // this.socket.on("message received", (newMainMessageReceived:any) => {
  //     console.log(newMainMessageReceived); // x8WIv7-mJelg7on_ALbx
  //   });


  this.communicationService.groupChatMessage.subscribe(newMessageReceived =>{
 console.log(newMessageReceived);
 if(this.allMainMessages.length){
  this.allMainMessages.forEach((element:any) => {
    if(element.chat.toString() === newMessageReceived.chat.toString()){
      if(element.messages.length){
        let filtered = element.messages.filter((individualMsg:any) => individualMsg._id === newMessageReceived._id)
        if(!filtered.length){
          element.messages.push(newMessageReceived)
        }
      }else{
        element.messages.push(newMessageReceived)
      }    
   
    }else{
      let obj = {chat:newMessageReceived.chat, messages:[newMessageReceived]}
  this.allMainMessages.push(obj);
  console.log(this.allMainMessages)
    }     
  });
}else{
  let obj = {chat:newMessageReceived.chat, messages:[newMessageReceived]}
  this.allMainMessages.push(obj)
  console.log(this.allMainMessages)
} 
this.scrollToBottom()



//  if(this.allMainMessages.length){
//   var filteredArray = this.allMainMessages.filter(function(msg:any){
//     return msg._id === res._id;
//   });
//   if(!filteredArray.length){
//     this.allMainMessages.push(res);
//   }
// }else{
//   this.allMainMessages.push(res);
// }


 });

  this.communicationService.allPublicRoomsEvent.subscribe(res =>{
    console.log(res)
    console.log(this.allPublicRooms)
   if(this.allPublicRooms.length){
      this.allPublicRooms.forEach((room:any) => {
        if(room.chatRoom.chatName !== res.chatRoom.chatName){
          this.allPublicRooms.push(res);
        }      
      });
    }else{
      this.allPublicRooms.push(res);
    }
    console.log(res)
    this.publicRooms(res);
  })
// this.communicationService.selectedRoom.subscribe(res =>{
//     console.log(res)
//     // this.selected.setValue(res)
//     // this.publicRooms(res)

//   })

// this.getAllUsers();
// this.currentUserName = localStorage.getItem('userName')
// this.currentUserId = localStorage.getItem('userId')
// this.socketService.listen("message received").subscribe((newMessageReceived)=>{
//   // console.log(newMessageReceived);
// })

}

// get mainWindow() {
//   return this.mainForm.get('mainChatInputs') as FormArray
// }

// addTab(selectAfterAdding: boolean) {
//   this.tabs.push('New');

//   if (selectAfterAdding) {
//     this.selected.setValue(this.tabs.length - 1);
//   }
// }

removeTab(index: number, tabName: string) {
  this.tabs.splice(index, 1);

  let removedRoom = this.allPublicRooms.filter((room:any) => room.chatRoom.chatName === tabName)
  let obj ={ roomId:  removedRoom[0].chatRoom._id, userId: this.currentUserId}
this.socket.emit('close chat', obj);
let filtered = this.allPublicRooms.filter((room:any) => room.chatRoom.chatName !== tabName)
this.allPublicRooms = filtered;
console.log(this.allPublicRooms )
this.selected.setValue(this.tabs.length - 1)
}

scrollToBottom(){
  setTimeout(() => {
    let objDiv = document.getElementById("message-list") as HTMLDivElement;
    objDiv.scrollTo(0, objDiv.scrollHeight+20);
  }, 0);
}

publicRooms(group:any){
  console.log(group);
  console.log(group);
  console.log(group);
  // const newPublicWindow = this.fb.group({
  //   publicMessage: group.chatRoom.latestMessage,
  //   chatRoomId: group.chatRoom._id,
  //   name: group.chatRoom.chatName
  // })
  // this.mainWindow.push(newPublicWindow);
  // console.log(this.mainWindow);
  // this.communicationService.getGroupById(publicGroup.chatRoom._id).subscribe(group =>{
    // this.openedTabs = this.communicationService.tabs
    // let group = groupChatRoom.chatRoom
    if(!this.tabs.includes(group.chatRoom.chatName)){
      this.tabs.push(group.chatRoom.chatName);
      this.communicationService.tabs = this.tabs;
      // setTimeout(() => {
        console.log(this.tabs)
        if (group) {
          // this.selected.setValue(this.tabs.length-1);
          // let ind = this.tabs.findIndex((tab:any) => tab ===group.chatRoom.chatName);
          // alert(ind)
          // this.selected.setValue(ind);
          this.mainForm.controls['selectedTabName'].setValue(group.chatRoom.chatName);
          this.mainForm.controls['selectedTabId'].setValue(group.chatRoom._id);
          this.mainForm.controls['selectedTabMessage'].setValue('');
   
        } else{
          alert("No group")
        }
      // }, 3000);
    
  
    }else{
      // alert("elseeeeee")
    }
    let ind = this.tabs.findIndex((tab:any) => tab ===group.chatRoom.chatName);
    this.selected.setValue(ind);
    console.log(group)
    this.setActiveBorderColor(group);

  // });



  // this.changeBackgroundColor(group);


  

}
setActiveBorderColor(group:any){
  console.log(group)
  this.activeColor = group.chatRoom.bgColor;
  localStorage.setItem('activeColor', group.chatRoom.bgColor)  
  setTimeout(() => {
    let borderColorDoms:any = document.querySelectorAll(".mdc-tab-indicator__content--underline");
    for (let item of borderColorDoms) {
      item.style.borderColor = group.chatRoom.bgColor;
  }
    let borderColorTabDoms:any = document.querySelectorAll(".mdc-tab.mat-mdc-tab.mat-mdc-focus-indicator.mdc-tab--active");
    for (let itemTab of borderColorTabDoms) {
      itemTab.style.borderColor = group.chatRoom.bgColor;
  }
  }, 0);
}
onTabChanged(event:any){
  console.log(event);
  console.log(this.allPublicRooms);
  // this.allPublicRooms.forEach((room:any) => {
  //   if(room.chatRoom.chatName === event.tab.textLabel){
  //     this.mainForm.controls['selectedTabName'].setValue(room.chatRoom.chatName);
  //     this.mainForm.controls['selectedTabId'].setValue(room.chatRoom._id);
  //     this.mainForm.controls['selectedTabMessage'].setValue('');
  //     this.socket.emit('join chat', room.chatRoom._id);
  // // this.setActiveBorderColor(room);

  //   }
  // });
  this.communicationService.checkUsers.next(true)
  let selectedGroup = this.allPublicRooms.filter((room:any) => room.chatRoom.chatName.toString() === event.tab.textLabel?.toString());
  this.communicationService.getGroupById(selectedGroup[0].chatRoom._id).subscribe(room =>{
    this.mainForm.controls['selectedTabName'].setValue(room.chatRoom.chatName);
    this.mainForm.controls['selectedTabId'].setValue(room.chatRoom._id);
    this.mainForm.controls['selectedTabMessage'].setValue('');
    this.socket.emit('join chat', room.chatRoom._id);
    // this.communicationService.allPublicRoomsEvent.next(room)
    this.communicationService.roomSpecificUsers = room.chatRoom.users
    console.log(this.communicationService.roomSpecificUsers);
  this.communicationService.selectedRoom.next(event.tab.textLabel);
  let filtered:any =this.communicationService.allGroups.filter((grp:any) => grp._id === room.chatRoom._id)
  console.log(filtered)
  room.chatRoom.bgColor = filtered[0].bgColor
    this.publicRooms(room);
  });
}
//   openMenu(name:string){
//     // // console.log("open: "+name);
//     (document.getElementById(name) as HTMLElement).style.display = 'block';

//   }
//   hideMenu(name: string){
//     // // console.log("close: "+name);
//     (document.getElementById(name) as HTMLElement).style.display = 'none';

//   }
//   openPrivate(user:any){
//     // // console.log(user);
//     // // console.log(this.mainWindow.controls.length)
//     // // console.log(this.mainWindow.controls.values)
//     socket.emit('setup', user);
//     socket.on("connection", () => {
//       this.isSocketConnected = true;
//     });

//     let focusedDoms:any = document.querySelectorAll(".focused")
//     focusedDoms.forEach((dom:any) => {
//       dom?.classList.remove("focused");      
//     });


//     if(this.mainWindow.controls.length >0){
//       if(this.mainWindow.controls.find((e:any) => e.value._id === user._id)){
//         let dom = document.getElementById("main-window"+user._id);
//         dom?.classList.add("focused");
//       }else{
//         this.checkChatRoom(user)
//       }
//     }else{
//       this.checkChatRoom(user)
//     }
//     // console.log(this.mainWindow);



//   }

//   checkChatRoom(user:any){
//     let payload = {
//       chatName: 'individual',
//       isGroupChat: false,
//       users : [user._id, this.currentUserId],
//       latestMessage: "",
//       groupAdmin: this.currentUserId
//     }
//         this.communicationService.openChat(payload).subscribe((res)=>{
//           // console.log(res);  
//           // socket.emit('output', res);
          
//       const mainWindow = this.fb.group({
//         privateMessage: "",
//         name: user.userName,
//         id: user._id,
//         gender:user.gender,
//         chatRoomId: res.chatRoom._id
//       })
//       this.mainWindow.push(mainWindow);
//       socket.emit('join chat', res.chatRoom._id);

//         });
//   }
//   // getPrivateMessageFromServer(){
//   //   this.communicationService.getPrivateMessage(payload).subscribe((res)=>{
//   //     // console.log(res);  
//   //     // this.privateMsgs =res; 
//   //     res.forEach((element:any) => {
//   //       let toUser = this.privateMsgs.find((e:any) => e.toId === element.toId);
//   //       if(toUser){
//   //         toUser.messages = res;
//   //         // toUser.type = type;
//   //       }else{
//   //         let obj = {
//   //           toId:element.toId,
//   //           messages : res,
//   //           // type: type
//   //         }
//   //         this.privateMsgs.push(obj)
//   //         // this.getPrivateMsgsById(this.mainForm.value.mainChatInputs[i].id)

//   //       }
//   //     }); 
     
      
//   //   })
//   // }

// closeMainWindow(window:any, index:any){
    // console.log(window)
    // console.log(window.value.chatRoomId)
    // socket.emit('close chat', window.value.chatRoomId);
    // this.mainWindow.removeAt(index);
      //     this.privateChats.forEach((element:any) => {
      //   // console.log(element._id+" === "+id)
      //   if(element._id === id){
  
      //   }        
      // });

  // }

  sendSelectedTabMsg(){
      console.log(this.mainForm.value)
      let content:any
      if(this.mainForm.value.selectedTabMessage !==""){
       content = this.mainForm.value.selectedTabMessage;
      }
      if(this.base64textString.length){
        content = this.base64textString[0]
      }
      const payload = {
        sender: localStorage.getItem("userId"),
        chat:this.mainForm.value.selectedTabId,
        content: content
      }
      this.communicationService.savePublicMessage(payload).subscribe((res)=>{
        console.log(res);
        let newMessageAndRoom = res.messages[res.messages.length-1]

   let selectedUser = res.chatRoom.users.filter((user:any) => user?.toString() === localStorage.getItem("userId")?.toString());
if(selectedUser.length === 0){
  res.chatRoom.users.push(localStorage.getItem("userId"))
}
        newMessageAndRoom.users = res.chatRoom.users   
        newMessageAndRoom.isGroupChat = true
        this.socket.emit("new message", newMessageAndRoom);
        let lastMessage = res.messages[res.messages.length-1]

        console.log(newMessageAndRoom)
        // if(this.allMainMessages.length){
        //   var filteredArray = this.allMainMessages.filter(function(msg:any){
        //     return msg._id === newMessageAndRoom._id;
        //   });
        //   if(!filteredArray.length){
        //     this.allMainMessages.push(newMessageAndRoom);
        //   }
        // }else{
        //   this.allMainMessages.push(newMessageAndRoom);
        // }
        if(this.allMainMessages.length){
          this.allMainMessages.forEach((element:any) => {
            if(element.chat.toString() === lastMessage.chat.toString()){
              element.messages.push(lastMessage)
            }else{
              let obj = {chat:lastMessage.chat, messages:[lastMessage]}
          this.allMainMessages.push(obj);
          // console.log(this.privateWindow.controls)
            }     
          });
        }else{
          let obj = {chat:lastMessage.chat, messages:[lastMessage]}
          this.allMainMessages.push(obj)
        }
        this.scrollToBottom();
        this.mainForm.controls['selectedTabMessage'].setValue("");
       
//         var valueArr = this.allMainMessages.map(function(item:any){ return item._id });
//         console.log(valueArr)
//         if(valueArr){
//           var isDuplicate = valueArr.some(function(item:any, idx:any){ 
//             return valueArr.indexOf(item) != idx 
//         });
//         console.log(isDuplicate);
// if(!isDuplicate){
//   this.allMainMessages.push(res);
// }
//         }else{
//           this.allMainMessages.push(res);

//         }


        // socket.emit("new message", newMessageAndRoom);
        // let lastMessage = res.messages[res.messages.length-1]
        // if(this.allMainMessages.length){
        //   this.allMainMessages.forEach((element:any) => {
        //     if(element.chat.toString() === lastMessage.chat.toString()){
        //       element.messages.push(lastMessage)
        //     }     
        //   });
        // }else{
        //   let obj = {chat:lastMessage.chat, messages:[lastMessage]}
        //   this.allMainMessages.push(obj)
        // }         
      });
      this.removeSelectedImage();
    // }
  }

  // sendMainMsg(i:any){
  //   // console.log(this.mainForm.value.mainChatInputs[i]);
  //   // console.log(this.mainForm);
  //   const payload = {
  //     sender: localStorage.getItem("userId"),
  //     chat:this.mainForm.value.mainChatInputs[i].chatRoomId,
  //     content: this.mainForm.value.mainChatInputs[i].privateMessage
  //   }
  //   this.communicationService.savePrivateMessage(payload).subscribe((res)=>{
  //     // console.log(res);  

  //     // socket.emit('output', res);
  //     // this.privateMsgs[i] =res; 
  //     // this.getPrivateMsgsById(this.mainForm.value.mainChatInputs[i], i);

  //     let newMessageAndRoom = res.messages[res.messages.length-1]
  //     newMessageAndRoom.users = res.chatRoom.users
  //     // newMessageAndRoom.chat = res.chatRoom._id
  //     // newMessageAndRoom.sender = res.messages[res.messages.length-1].sender      
  //     this.socket.emit("main new message", newMessageAndRoom);
  //     let lastMessage = res.messages[res.messages.length-1]
  //     if(this.allMainMessages.length){
  //       this.allMainMessages.forEach((element:any) => {
  //         if(element.chat.toString() === lastMessage.chat.toString()){
  //           element.messages.push(lastMessage)
  //         }     
  //       });
  //     }else{
  //       let obj = {chat:lastMessage.chat, messages:[lastMessage]}
  //       this.allMainMessages.push(obj)
  //     } 

  //     // res.forEach((element:any) => {
  //     //   let toUser = this.privateMsgs.find((e:any) => e.toId === element.toId);
  //     //   if(toUser){
  //     //     toUser.messages = res;
  //     //     // toUser.type = type;
  //     //   }else{
  //     //     let obj = {
  //     //       toId:element.toId,
  //     //       messages : res,
  //     //       // type: type
  //     //     }
  //     //     this.privateMsgs.push(obj)
  //     //     // this.getPrivateMsgsById(this.mainForm.value.mainChatInputs[i].id)

  //     //   }
  //     // }); 
     
      
  //   })

  // }
//   getPrivateMsgsById(formValue:any, index:any){
//     // // console.log(id)
//     // console.log(this.privateMsgs, index)
//     if(this.privateMsgs.length){
//       let filteredMsgs = this.privateMsgs[index]?.messages;
//       // // console.log(filteredMsgs[0]?.messages);
//       filteredMsgs.forEach((element:any) => {
//         let type ="";
//         // // console.log(element.fromId?.toString() +"=== "+localStorage.getItem('userId')?.toString())
//         if(element.sender?.toString() === localStorage.getItem('userId')?.toString()){
//           type = "sent"
//         }else{
//           type = "received"            
//         }
//         element.type =  type;
//       });
//     // return filteredMsgs;
//     // console.log(this.privateMsgs)
//     // console.log(filteredMsgs)
//     }
//     // let filteredMsgs = this.privateMsgs.filter((e:any) => e.toId.toString() === id.toString());

//     // // console.log(filteredMsgs[0]?.messages)
//   }
//   renderMessages(window:any, index:any){
//     // // console.log(this.privateMsgs, index)
//     // console.log(window)
//     let formValue = window.value;
//     // console.log(formValue)
//     if(this.allMainMessages.length){
//       let filteredMsgs:any = [];
//       this.allMainMessages.forEach((element:any) => {
//         if(element.chat.toString() === formValue.chatRoomId.toString()){
//           filteredMsgs.push(element)
//         }     
//       });
//       // console.log(filteredMsgs[0]?.messages)
//     return filteredMsgs[0]?.messages;
//     }
//   }
//   getAllUsers(){
//     this.communicationService.getAllUsers().subscribe((res)=>{
//       // console.log(res)
//       this.users = res;     
//     })
  // }
  closeMainChat(){

  }

  changeBackgroundColor(room:any) {
  //   let allTabs:any = document.getElementsByClassName('mdc-tab-indicator__content mdc-tab-indicator__content--underline'); 
  //   console.log(allTabs)
  //   console.log(room)
  //   for (let activeTab of allTabs) {
  //     (activeTab as HTMLElement).style.borderColor = 'green';
  // }
  //   let allTextLabels:any = document.querySelectorAll(".mdc-tab__text-label");
  //   console.log(allTextLabels)
  //   // document.getElementsByClassName('mdc-tab__text-label'); 
  //   for (let textDom of allTextLabels) {
  //     let text = (textDom as HTMLElement);
  //     console.log(text  +"==="+ room.chatRoom.chatName)
  //     if(text === room.chatRoom.chatName){
  //     console.log(text  +"==="+ room.chatRoom.chatName)

  //       let specificTab = textDom.closest(".mdc-tab-indicator__content mdc-tab-indicator__content--underline")
  //       specificTab.style.borderColor = room.chatRoom.bgColor
  //     }
  // }
  
  }
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
var curPos:any =   (document.getElementById("mainChatInput") as HTMLInputElement).selectionStart; 
let x = this.mainForm.controls['selectedTabMessage'].value; 
let text_to_insert = event.emoji.native; 
this.mainForm.controls['selectedTabMessage'].setValue(x.slice(0, curPos) + text_to_insert + x.slice(curPos)); 
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

  onUploadChange(evt: any) {
    evt.stopPropagation()
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

    // this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.base64textString =['data:image/png;base64,' + btoa(e.target.result)];
    console.log(this.base64textString)
  }
  removeSelectedImage(){
    this.base64textString=[];
    this.fileName="";
  }

}
