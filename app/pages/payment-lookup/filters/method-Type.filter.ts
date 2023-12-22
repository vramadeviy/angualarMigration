import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'MethodTypeSearchPipe', pure: false })
export class MethodTypeSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
     
    
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }

    return items.filter(item => {
     // return item.paymentMethod.includes(criteria);
      return item.methodType === criteria[0];
    });         
   }
}
