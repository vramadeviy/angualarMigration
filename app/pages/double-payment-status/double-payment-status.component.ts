import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { PaymentLookupService } from '../payment-lookup/payment-lookup.service';
@Component({
  selector: 'app-double-payment-status',
  templateUrl: './double-payment-status.component.html',
  styleUrls: ['./double-payment-status.component.scss'],
  providers:[PaymentLookupService],
  encapsulation: ViewEncapsulation.None
})
export class DoublePaymentStatusComponent implements OnInit {
  public lookupResult=[];
  expanded = "";
  public selectedItem;
taxTypeList = [
    { item_id: 1, item_text: 'Accepted' },
    { item_id: 2, item_text: 'Cancelled' },
    { item_id: 3, item_text: 'Double Payment' },
    { item_id: 4, item_text: 'Double Payment-Auditor' },
    { item_id: 5, item_text: 'Double Payment-Refunded' },
    { item_id: 6, item_text: 'Forward' },
    { item_id: 7, item_text: 'held' },
  ];
 
  selectedItems=[];
  _settings=1;
  onItemClick($event: any, item: any) {
    this.selectedItem = item;
    // if (this.disabled) {
    //   return false;
    // }

    const found = this.isSelected(item);
    const limit = this.selectedItems.length < this._settings ? true : false;

    if (!found) {
      if (this._settings) {
        if (limit) {
          this.addSelected(item);
        }
      } else {
        this.addSelected(item);
      }
    } else {
     // this.removeSelected(item);
    }
    
  }
  isSelected(clickedItem: any) {
   
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }
  addSelected(item: any) {
    if (this._settings) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item);
    }

  }
  constructor(public paymentLookupService:PaymentLookupService) { 
    this.getPaymentLookupData(data => {
      this.lookupResult = data;
      // this.setPage(1);
    });
  }
  public getPaymentLookupData(data) {
    this.paymentLookupService.get().subscribe(response => {
      data(response.data);

    },
      (err) => {
        console.log('get payment lookup error', err);
      });
  }
  ngOnInit() {
    $("#clscroll-content").scroll(function() {
      $("#clscroll-row-headers").scrollTop($("#clscroll-content").scrollTop());
      $("#clscroll-column-headers").scrollLeft($("#clscroll-content").scrollLeft());
  });
  
  $("#clscroll-column-headers").scroll(function() {
      $("#clscroll-content").scrollLeft($("#clscroll-column-headers").scrollLeft());
  });
  
  $("#clscroll-row-headers").scroll(function() {
      //$("#clscroll-content").scrollTop($("#clscroll-row-headers").scrollTop());
  });

  }
  toggleRow(index) {
    this.expanded = (this.expanded !== index) ? index : "";
  }

}
