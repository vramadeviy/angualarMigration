
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PaymentReasonSearchPipe', pure: false })
export class PaymentReasonSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      return item.reason.toLowerCase().startsWith(criteria.toLowerCase());
    });
  
}
}
