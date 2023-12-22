
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'SupplementalTypeSearchPipe', pure: false })
export class SupplementalTypeSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      if(item.supType){
        return item.supType.toLowerCase().startsWith(criteria[0].toLowerCase());
      }
    });
}
}
