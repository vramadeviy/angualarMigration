import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UpdatedBySearchPipe', pure: false })
export class UpdatedBySearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      return item.createdBy.startsWith(criteria);
    });
  }
}
