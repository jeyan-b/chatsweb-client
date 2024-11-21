import { Pipe, PipeTransform } from '@angular/core';
import { CommunicationService } from './rooms/services/communication.service';

@Pipe({
    name: 'getUserName',
    pure: false
})
export class UserNameFilterPipe implements PipeTransform {
users:any = [];
    constructor(private communicationService: CommunicationService){

    }
    transform(filter: any): any {
        // console.log(items);
        // console.log(filter);
        this.users = this.communicationService.users;
        if (!this.users || !filter) {
            return this.users;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        let user:any = this.users.filter((user:any) => user._id.toString() == filter.toString());
    //    console.log(user)
        if(!user || user.length === 0){
            this.communicationService.checkUsers.next(true);
        }
        // console.log(messages[0]?.messages);
        let name :any;
        if(user[0]?.firstName === 'unknown'){
            name = user[0]?.userName 
        }else{
            name = user[0]?.firstName+" "+user[0]?.lastName
        }
         return name
    }
}