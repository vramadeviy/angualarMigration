
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PaymentStatusSearchPipe', pure: false })
export class PaymentStatusSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
     return item.paymentStatus === criteria[0].item_text;
    });
  
}
}

