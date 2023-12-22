import { Component, OnInit, ViewEncapsulation, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { PagerService } from '../payment-lookup/pager.service'
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit, OnChanges {

  public getLookupSearchResult = [];
  pager: any = {};
  // paged items
  pagedItems: any[];
  @Input() public paginationData: any[];
  @Output() public pageChangeEvent = new EventEmitter();

  constructor(public pagerService: PagerService) { }

  ngOnInit() {
    this.setPage(1)
  }
  
/**
 * 
 * @method ngOnChanges 
 * @description call when page change
 * @param {{ [propKey: string]: SimpleChange }} changes 
 * @memberof PaginationComponent
 */
ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log;
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = changedProp.currentValue;
      if (changedProp.isFirstChange()) {
        log = to;
      } else {
        let from = changedProp.currentValue;
        log = from;
      }
    }
    this.paginationData = log;
    this.setPage(1);
  }

  /**
   * 
   * @method setPage
   * @description create the pagination field based on response
   * @param {number} page 
   * @returns 
   * @memberof PaginationComponent
   */
  setPage(page: number) {
    
    // if (page < 1 || page > this.pager.totalPages) {
    //   return;
    // }
    // get pager object from service
    // this.pager = this.pagerService.getPager(100, page); //this.paginationData.length
    // get current page of items
    
    this.pager = this.pagerService.getPager(this.paginationData.length, page);
    this.getLookupSearchResult = this.paginationData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.pageChangeEvent.emit(this.getLookupSearchResult);
  }

}
