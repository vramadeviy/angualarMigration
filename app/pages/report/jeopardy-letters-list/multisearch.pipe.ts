import { Pipe, PipeTransform } from '@angular/core';
// import { pipe } from 'rxjs';

@Pipe({ name: 'multiPropFilter', pure: false })
export class MultiPropFilter implements PipeTransform{
    transform(items,searchText,propNames){
        if(!items || !searchText){
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item=>{
            return propNames.some(propName=>{
                const propValue = item[propName].toLowerCase();
                return propValue.includes(searchText);
            });
        });
    }
}