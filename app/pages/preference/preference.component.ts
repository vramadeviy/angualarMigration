import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { lookupTableHeaderData } from "./headers.list.model";
import { ListItem } from './list-tem-model';
import { MenuService } from '../../theme/components/menu/menu.service';
import { GlobalTaxToolService } from '../_service/global-taxtools-service';
import { menuData } from "../common-directive/menu-data";
import { PreferenceService } from './preference-service';
import { HttpErrorResponse } from '@angular/common/http';


declare var $: any;
const noop = () => { };
@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
  providers: [MenuService, PreferenceService],
  encapsulation: ViewEncapsulation.None
})
export class PreferenceComponent implements OnInit {

  public PreferenceTableHeaderData = [];
  public headerContainer: any;
  public isChecked;
  public dropdownSettings = {};
  public paymentStatusOption = [];
  public _taxLookupOption = [];
  public selectedTaxHeaderItem = [];
  public preference_page = [];
  public taxToolPreferencePageSelectedOption;
  allItemsSelected: boolean;
  public subscription: any;
  globalData: any;
  public isPreferencePageSaved = false;
  isPreferencePageFailed = false;
  public isTableHearSelected;     // hold validation for preference page header length <=6 ;it hold boolean value
  allTableHeaderData = [];
  selectedLandingPage: any;
  menuItemsAssigned = [];
  allMenuItems = [];
  selectedItems = [];

  constructor(private cdRef: ChangeDetectorRef,
    public menuService: MenuService,
    public _globalTaxToolService: GlobalTaxToolService,
    public preferenceService: PreferenceService
  ) {
    this.allItemsSelected = false;
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      data: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unselectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: false
    };
  }


  private getUserInfo() {
    var data = this._globalTaxToolService.getData();
    this.globalData = data;
    this.selectedTaxHeaderItem = data.paymentLookupHeaders;
    this.selectedLandingPage = data.prefferedLandingPage.toString();
    this.setPreferenceTableHeaderData(data.paymentLookupHeaders);
    this.setLandingPageItems(data.screens.split(","));

  }

  public selectAllItem() {
    for (var i = 0; i < this.PreferenceTableHeaderData.length; i++) {
      this.PreferenceTableHeaderData[i].isSelected = this.allItemsSelected;
    }
  }

  private setLandingPageItems(screensArray) {
    for (var screenId of screensArray) {

      var menuItem = this.allMenuItems.find(x => x.item_id == screenId);
      if (menuItem) {
        this.menuItemsAssigned.push(menuItem);
        if (menuItem.item_id == this.selectedLandingPage)
          this.selectedItems.push(menuItem)
      }

    }

  };

  private setPreferenceTableHeaderData(selectedHeaderData) {
    var selectedCount = 0;
    for (var selHeader of selectedHeaderData) {
      selectedCount++;
      var selColumn = this.allTableHeaderData.find(x => x.item_id == selHeader);
      selColumn.isSelected = true;
      this.PreferenceTableHeaderData.push(selColumn);

    }
    for (var selHeader of this.allTableHeaderData) {
      if (selHeader.isSelected == false)
        this.PreferenceTableHeaderData.push(selHeader);
    }
    this.isAllSelect(selectedCount);
  }

  public isAllSelect(count) {
    if (count == this.allTableHeaderData.length) {
      this.allItemsSelected = true;
    }
  }
  ngOnInit() {
    this.allTableHeaderData = lookupTableHeaderData.map(x => Object.assign({}, x));
    this.allMenuItems = menuData;
    this.getUserInfo();
    this.scrollConfig();
    $('table tbody').sortable({
      items: '.dragger-container',
      axis: 'y',
    
    }).disableSelection();
  }

  private scrollConfig() {
    // $('.pane-hScroll').scroll(function () {
    //   $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
    //   $(".pane-vScroll").scrollLeft($(".pane-vHeaderScroll") + $('.pane-hScroll').scrollLeft());
    // });
  }
  ngAfterViewInit() {
      $('td, th').each(function () {
        var cell = $(this);
        cell.width(cell.width()+140);
    });
  }

  selectEntity(item, index) {
    if (item.isSelected) {
      this.PreferenceTableHeaderData[index].isSelected = true;
    } else {
      this.PreferenceTableHeaderData[index].isSelected = false
    }
    // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
    for (var i = 0; i < this.PreferenceTableHeaderData.length; i++) {
      if (!this.PreferenceTableHeaderData[i].isSelected) {
        this.allItemsSelected = false;
        return;
      }
    }
    this.allItemsSelected = true;
  }

  public savePreferencePageData() {
    const preferenceSelectedHeaderItem = [];
    $('#preferenceHeaderTable td #selectedHeaderItem').each(function (i) {
      preferenceSelectedHeaderItem.push($(this).text());
    });

    this.globalData.paymentLookupHeaders = preferenceSelectedHeaderItem;
    this.globalData.prefferedLandingPage = +this.selectedLandingPage;

    const postParam = {
      preferenceLookupHeaders: preferenceSelectedHeaderItem,
      preferencePage: this.selectedLandingPage,
      userId: this.globalData.userId
    }
    if (preferenceSelectedHeaderItem.length >= 6) {
      this.preferenceService.setPreferencePageTableHeader(postParam).subscribe(responseData => {

        this.isPreferencePageSaved = true;
        this.isTableHearSelected = false;
        setTimeout(() => {
          this.isPreferencePageSaved = false;
        }, 5000);
      }, (err: HttpErrorResponse) => {
        this.isPreferencePageFailed = true;
        setTimeout(() => {
          this.isPreferencePageFailed = false;
        }, 5000);
      });
    } else {
      this.isTableHearSelected = true;
    }



  }





  onItemSelect(item: any) {
    this.selectedLandingPage = item.item_id;
    //console.log("sel" + this.selectedLandingPage);
  }
}


