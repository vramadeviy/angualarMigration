import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PaymentMethodSearchPipe', pure: false })
export class PaymentMethodSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
     
    
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }

    return items.filter(item => {
     // return item.paymentMethod.includes(criteria);
      return item.paymentMethod === criteria[0].item_text;
    });         
   }
}
