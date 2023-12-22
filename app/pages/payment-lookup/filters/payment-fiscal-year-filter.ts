import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PaymentFiscalYearSearchPipe', pure: false })
export class PaymentFiscalYearrSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
     // return item.paymentFiscalYear.toString().includes(criteria);
      return (item.paymentFiscalYear+'/'+(item.paymentFiscalYear+1)).toString().startsWith(criteria);
     
    });
  }
}
