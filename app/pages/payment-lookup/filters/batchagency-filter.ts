import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'BatchAgencySearchPipe', pure: false })
export class BatchAgencySearchPipe implements PipeTransform {
    transform(items: any[], criteria: any, key: any): any {
        if (!items) {
            return [];
        }
        if (!criteria) {
            return items;
        }
        return items.filter(item => {            
            return item['paymentDetails']['0'].agencyName === criteria[0]
        });

    }
}

