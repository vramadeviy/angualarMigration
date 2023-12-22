import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'NCRNumberSearchPipe', pure: false })
export class NCRNumberSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
       return item.ncrSequenceNo.toString().startsWith(criteria);    
    });
  }
}
