import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        // console.log(items);
        // console.log(filter);
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        let messages:any = items.filter(item => item.chat.toString() == filter.toString());
        // console.log(messages[0]?.messages);
         return messages[0]?.messages
    }
}