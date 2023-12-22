
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PaymentSourceSearchPipe', pure: false })
export class PaymentSourceSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
       return item.paymentSource.toLowerCase() === criteria[0].item_text.toLowerCase();
   //   return item.paymentSource.includes(criteria);

    });
  
}
}
