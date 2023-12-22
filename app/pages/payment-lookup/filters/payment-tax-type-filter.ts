
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PaymentTaxTypeSearchPipe', pure: false })
export class PaymentTaxTypeSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      return item.taxType.toLowerCase() === criteria[0].item_text.toLowerCase();
    });
  
}
}
