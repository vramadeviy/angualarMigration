import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TracerNumberSearchPipe', pure: false })
export class TracerNumberSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
           return item.tracerNo.startsWith(criteria);    
    });
  }
}
