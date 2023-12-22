import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'InstallmentSearchSearchPipe', pure: false })
export class InstallmentSearchSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      return item.installNo === criteria[0].item_id;
    });
  
}
}
