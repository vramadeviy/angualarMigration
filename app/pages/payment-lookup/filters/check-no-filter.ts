import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CheckNumberSearchPipe', pure: false })
export class CheckNumberSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      return item.checkNo.startsWith(criteria);
    });
  }
}
