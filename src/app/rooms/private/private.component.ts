import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {

  @Input() users: any;
  @Output() openPrivateFromChild = new EventEmitter();
  @Output() mentionFromChild = new EventEmitter();
  currentUserId:any;
  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId')

  }
  openMenu(name:string){
    // // console.log("open: "+name);
    (document.querySelector(".users-list ul") as HTMLElement).style.overflowY = 'initial';
    (document.getElementById(name) as HTMLElement).style.display = 'block';

  }
  hideMenu(name: string){
    // // console.log("close: "+name);
    // (document.querySelector(".users-list ul") as HTMLElement).style.overflowY = 'auto';
    (document.getElementById(name) as HTMLElement).style.display = 'none';

  }
}