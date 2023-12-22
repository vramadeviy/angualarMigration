import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ApnSearchPipe', pure: false })
export class ApnSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      if(item.apn)     
         return item.apn.startsWith(criteria);
    });
  }
}
