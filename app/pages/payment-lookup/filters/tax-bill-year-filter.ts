import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TaxBillYearSearchPipe', pure: false })
export class TaxBillYearSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      //return item.taxBillFiscalYear.toString().startsWith(criteria);
      return (item.paymentFiscalYear+'/'+(item.paymentFiscalYear+1)).toString().startsWith(criteria);
      
    });
  }
}
