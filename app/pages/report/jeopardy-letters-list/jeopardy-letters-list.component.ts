import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { JeopardyLettersListService } from './jeopardy-letters-list.service';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';

@Component({
  selector: 'app-jeopardy-letters-list',
  templateUrl: './jeopardy-letters-list.component.html',
  styleUrls: ['./jeopardy-letters-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JeopardyLettersListComponent implements OnInit {

  @ViewChild('instance') paginationInstance;
  public search = {
    year: 2023
  };
  public APNYearList = [{
    key: 2023,
    label: '2023'
    // }, {
    //   key: 2022,
    //   label: '2022'
    // }, {
    //   key: 2021,
    //   label: '2021'
    // }, {
    //   key: 2020,
    //   label: '2020'
    // }, {
    //   key: 2019,
    //   label: '2019'
    // }, {
    //   key: 2018,
    //   label: '2018'
    // }
  }];
  public page = 1;
  public totalPages: number[] = [0, 1, 2, 3, 4];
  public pageRecordLimitData: number[] = [10, 25, 50, 100];
  public pageRecordLimit = 10;
  public jeopardyLettersTypes = [{
    key: 'JeopardyLetters',
    label: 'Jeopardy Letters'
  }, {
    key: 'LabelDocument',
    label: 'Label Document'
  }, {
    key: 'PublicationDocument',
    label: 'Publication Document'
  }, { key: 'All', label: 'All' }];
  public genType = 'JeopardyLetters';
  public selectedUniqeJeopardyLetters = {};

  public jeoPardyLetterList = [];
  public notificationText = null;
  public jeoPardyPreviewList = [];
  public order = ['defaultYear', 'parcel']; // 'modifiedDate';// for sort bydefault name
  public reverse = true; // sort order
  public start;
  public last;
  public filterTableHeaderData = [{
    'item_id': 'parcel',
    'item_text': 'Parcel',
    'searchType': ['parcel']
  },
  {
    'item_id': 'address',
    'item_text': 'Address',
    'searchType': ['mailAddress1', 'mailAddress2', 'mailAddress3', 'mailZip', 'situsAddress1', 'situsAddress2', 'situsAddress3', 'situsZip']
  }];
  searchParams;
  p = 1;
  public dropdownSingleSelectSettings = {
    singleSelection: true,
    idField: 'searchType',
    data: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unselectAllText: 'Unselect All',
    itemsShowLimit: 1,
    allowSearchFilter: false
  };
  public selectedtableHeader;
  public searchKey;
  public jeopardyListCopy = [];
  public totalSelectedCount = 0;
  public userPrivilege = {
    'canCertify': true,
    'canApprove': true,
    'canEditJPL': true,
    'canViewJPL': true
  };
  constructor(private jeopardyLetterService: JeopardyLettersListService, private globalTaxToolService: GlobalTaxToolService) {
  }

  public getUserPrivilege​() {
    const userDate = this.globalTaxToolService.getData();
    this.jeopardyLetterService.getUserPrivilege​(userDate.userId).subscribe(response => {
      this.userPrivilege['canEditJPL'] = response.canEditJPL;
      this.userPrivilege['canViewJPL'] = response.canViewJPL;
      this.getGeoPardyLettersList();
    }, err => {
      this.getGeoPardyLettersList();
    });
  }
  ngOnInit() {
    this.getUserPrivilege​();

    this.jeoPardyLetterList = [];
  }
  private sortResponse(list) {
    return list.sort((a, b) => {
      // Compare by the "defaultYear" key
      if (a.defaultYear < b.defaultYear) {
        return -1;
      }
      if (a.defaultYear > b.defaultYear) {
        return 1;
      }

      // If defaultYear are equal, compare by the "parcel" key
      if (a.defaultYear < b.defaultYear) {
        return -1;
      }
      if (a.defaultYear > b.defaultYear) {
        return 1;
      }

      return 0; // Objects are equal
    });
  }
  public getGeoPardyLettersList(): void {
    this.jeopardyLetterService.getJeoPardyLettersList(this.search.year).subscribe(response => {
      this.jeoPardyLetterList = this.sortResponse(response);
      this.jeopardyListCopy = response;
      try {
        response.map(item => {
          if (!!item.canProcess) {
            this.totalSelectedCount++;
          }
        });
      } catch (error) {

      }

      this.pageChanged(this.page);
      // this.getJeopardyPreviewList();
    }, err => {
      this.jeoPardyLetterList = [];
    });
  }

  public onRowEditClick(item) {
    if (!!item.isClicked) {
      item.isClicked = false;
    } else {
      item.isClicked = true;
    }
  }

  public getJeopardyPreviewList = function () {
    this.jeoPardyPreviewList = [];
    this.jeoPardyLetterList.map((item) => {
      if (!!item.canProcess) {
        this.jeoPardyPreviewList.push(item);
      }
    })
  }
  public onChangeCanProcess(item): void {
    this.saveJeopardyLettersList(item);

  }
  public saveJeopardyLettersList(item): void {
    const payload = [item];
    this.notificationText = null;
    // for (const key in this.selectedUniqeJeopardyLetters) {
    //   if (this.selectedUniqeJeopardyLetters.hasOwnProperty(key)) {
    //       payload.push(this.selectedUniqeJeopardyLetters[key]);

    //   }
    // }
    this.jeopardyLetterService.updateJeopardyLetter(payload).subscribe(response => {
      this.jeoPardyLetterList.map(jeoPardyItem => {
        if (jeoPardyItem.parcel === item.parcel) {
          if (item.canProcess) {
            jeoPardyItem.canProcess = true;
            this.totalSelectedCount++;
          } else {
            jeoPardyItem.canProcess = false;
            this.totalSelectedCount--;
          }
        }
      });

    }, (err) => {
      this.jeoPardyLetterList.map(jeoPardyItem => {
        if (jeoPardyItem.parcel === item.parcel) {
          jeoPardyItem.canProcess = !item.canProcess
        }
      });
      ;
      // this.notificationText ="Failed to update";
    });
  }
  public generateJeopardyLettersList(): void {
    const payload = {
      processYear: this.search.year,
      genType: this.genType
    };
    this.notificationText = null;
    this.jeopardyLetterService.generateAllJeopardyLetter(payload).subscribe(response => {
      this.notificationText = 'Report generated successfully!!';
    }, err => {
      // this.notificationText ="try after sometime";
    });
  }
  public reset(form) {
    form.resetForm();
    this.search.year = 2023;
  }
  /**
   * pageChanged
   */
  public pageChanged($event: number): void {
    // this.p= $event;
    this.start = $event;
    this.start = this.start * this.pageRecordLimit - (this.pageRecordLimit - 1);
    this.last = $event * this.pageRecordLimit;
    if (this.last > this.jeoPardyLetterList.length) {
      this.last = this.jeoPardyLetterList.length;
    }
  }
  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
  onHeaderSelect(item) {
    this.notificationText = null;
    this.searchParams = item.searchType;
  }
  filterJeopardyList(searchText) {
    this.notificationText = null;
    // if(searchText){
    //   this.jeoPardyLetterList = this.jeopardyListCopy.filter(item=>{
    //     return item.parcel.indexOf(searchText);
    //   });
    // }else{
    //   this.jeoPardyLetterList = [...this.jeopardyListCopy];
    // }

  }
}
