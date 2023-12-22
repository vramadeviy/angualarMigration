import { Pipe, PipeTransform } from '@angular/core';
import { $ } from 'protractor';

@Pipe({ name: 'PaymentTotalsPipe', pure: false })
export class PaymentTotalsPipe implements PipeTransform {
  transform(items: any[],  setFilterdItems: any): any {
   
    if (!items) {
        return [];
      } 
      
      setFilterdItems(items);
    return items;      
  }
}
