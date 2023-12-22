import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'BatchNoSearchPipe', pure: false })
export class BatchNoSearchPipe implements PipeTransform {
  transform(items: any[], criteria: any,key:any): any {
    if (!items) {
      return [];
    }
    if (!criteria) {
      return items;
    }
    return items.filter(item => {
      if(item.batchNo){
        let batchNoLength=item.batchNo.toString().length;
        if(batchNoLength==1){
          let batchNo='00'+item.batchNo.toString();
          return batchNo===criteria;; 
        }else if(batchNoLength==2){
          let batchNo='0'+item.batchNo.toString();
          return batchNo===criteria;
        }else{
          return item.batchNo.toString()===criteria;
        }
      }
      
          
    });
  }
}
