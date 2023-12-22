import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TellerNumberSearchPipe', pure: false })
export class TellerNumberSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
       return item.tellerNo.toString().startsWith(criteria);
    });
  }
}
