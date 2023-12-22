import { NgModel } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, Renderer2, Input, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";

import { SearchCriteria } from '../payment-lookup/search-criteria';
import { csvHeader } from '../payment-lookup/csv-modal'; // for csv build 
import { DownloadService } from '../_service/download-service'; // csv download service
import { RadioOptions } from '../payment-lookup/search-criteria-mock';
import { PaymentLoopupFormat } from '../payment-lookup/payment-lookup-format';
import { PaymentLookupService } from '../payment-lookup/payment-lookup.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { PagerService } from '../payment-lookup/pager.service';
import { PaginationComponent } from '../pagination/pagination.component'
import { isArray, isObject } from 'util';
import { HelperCommonMethod } from "../_service/payment-common";
import { Observable } from 'rxjs/Rx';
import * as tableDragger from 'table-dragger';
import { ScriptLoaderService } from '../_service/script-loader.service';
//import { ViewAuthTokenService } from './ViewAuthTokenService';
import { skip } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppValidationMessages } from "./filters/validatiom-message";
import { PaymentInstallmentData } from "./payment-lookup-data/payment-lookup-installment-data";
import { paymentStatusData } from "./payment-lookup-data/payment-lookup-status-data";
import { paymentSourcesData } from "./payment-lookup-data/payment-sources-data";
import { paymentTaxData } from "./payment-lookup-data/tax-type-data";
import { paymentReasonData } from "./payment-lookup-data/reason-data";
import { lookupTableHeaderData } from "./payment-lookup-data/lookup-table-header-data";
import { lookupDropdownData } from "./payment-lookup-data/lookup-dropdown-sign-data";
import { paymentMethodData } from "./payment-lookup-data/payment-method-dropdown-data";
import { MethodType } from "./payment-lookup-data/method-type.data";
import { SupplementalType } from "./payment-lookup-data/supplemental-type.data";
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
//import { NgbDateFRParserFormatter } from "./ngb-date-fr-parser-formatter"
import { OrderPipe } from 'ngx-order-pipe';
import { GlobalTaxToolService } from '../_service/global-taxtools-service';
import { BatchAgencyData } from "./payment-lookup-data/batch-agency-data";
import { NgbDateFRParserFormatter } from "../common-directive/ngb-date-picker/ngb-date-fr-parser-formatter"
import { fdatasync } from 'fs';
import { NgbDatepickerPopup } from '../common-component/ngb-date-picker/datepicker-popup';
import { CommonService } from '../_service/common.service';
import { PaymentMethod } from './payment-lookup-data/payment-method-data';

declare var $: any;

@Component({
  selector: 'app-payment-lookup',
  templateUrl: './payment-lookup.component.html',
  styleUrls: ['./payment-lookup.component.scss'],
  providers: [PaymentLookupService, DownloadService, PagerService, HelperCommonMethod, ScriptLoaderService, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class PaymentLookupComponent implements OnInit, AfterViewInit {
  p: number = 1;
  public ngbDatepickerPopup: NgbDatepickerPopup;
  page = 1;
  totalPages = [0, 1, 2, 3, 4];
  public totalAountForAPN;
  public filterType;
  public rowCount;
  public filteredItems;
  public apnSearchform: FormGroup;
  private formSubmitAttempt: boolean;
  public csvHeader = csvHeader;                        // CSV Header List
  public reasonData = paymentReasonData;
  public paymentMethodData = paymentMethodData;
  public methodTypeDate = MethodType;
  public supplementalTypeDate = SupplementalType;
  public order = 'null';// for sort bydefault name
  reverse: boolean = false;// sort order
  public isFieldValidCheck = false;
  public isTaxFieldValidCheck = false;
  public isTransactionValidCheck = false;
  // ng model key for search
  public selectedtableHeader;
  public apnKey;
  public updatedByKey;
  public paymentfiscalyearKey;
  public batchNoKey;
  public checkhNoKey;
  public tellerNoKey;
  public tracerNoKey;
  public ncrNoSearchKey;
  public taxBillYearSearchKey;
  public searchInstallmentSearchKey;
  public paymentStatusSearchKey;
  public paymentReasonSearchKey;
  public paymentSourceSearchKey;
  public paymentTaxTypeSearchKey;
  public totalAmountKey;
  public selectedSignKey;
  public paymentMethodSearchKey;
  public paymentTotalSearchKey;
  public batchAgencySearchKey;
  public supplementalTypeSearchKey;
  public methodTypeSearchKey;
  // end ng model key for search

  public isTotalsNotAddedToCSV = true;
  //validation 
  public isDateFormatWrong = false;
  public isMandatoryWrong = false;
  public isToDayDate = true;
  public isAPNValid = false;
  public isToDate = false;
  public isAPNLengthValid = false;
  public isTracerLengthValid = false;
  public isFromToDateFormatWrong = false;
  public isDateGreatherLessThanFromDate = false;
  public transactionlNGModal = {
    Payment_From: "",
    Payment_To: "",
    fiscal_Year_From: "",
    fiscal_Year_To: "",
    payment_Status: [],
    payment_Source: [],
    t_type: []
  }
  public creditNGModal = {
    Payment_From: "",
    Payment_To: "",
    fiscal_Year_From: "",
    fiscal_Year_To: "",
    payment_Status: [],
    payment_Source: [],
    t_type: []
  }
  public depositNGModal = {
    Payment_From: "",
    Payment_To: "",
    fiscal_Year_From: "",
    fiscal_Year_To: "",
    payment_Status: [],
    payment_Source: [],
    t_type: []
  }
  dt;


  public apnLengthValidation = false;
  public tracerLengthValidation = false;
  public formValidation = {
    "apnNumber": {
      "hasValue": false,
      "isValid": false,
      "value": ""
    },
    "tracerNumber": {
      "hasValue": false,
      "isValid": false,
      "value": ""
    }
  }
  public paymentFiscalNGModal = {
    fiscal_Year: [],
    payment_Status: [],
    payment_Source: [],
    t_type: []
  }
  public TaxFiscalNGModal = {
    fiscal_Year: [],
    payment_Status: [],
    payment_Source: [],
    t_type: []
  }
  public spinnerLoading = false;     // Loader icon property
  public entries = [];               // radio button selection property
  public getLookupSearchResult: PaymentLoopupFormat[] = [];      // hold payment seach result 
  public serachTypeObject = RadioOptions;               // dynamic radio array of Object 
  public totalLength = 0;                         // total length for Json Object 
  selectedEntry: { [key: string]: any } = {
    value: null,
    description: null
  };
  depositPaymentToDate;
  @ViewChild(PaginationComponent) pagerData;
  installmentList = [];
  selectResultConditon = [];
  paymentStatusOption = [];
  paymentSourceList = [];
  paymentYearList = [];
  taxTypeList = [];
  perPageRecord = [];

  filterTableHeaderData = [];
  dropdownSettings = {};
  dropdownSingleSelectSettings = {};
  selectedHeaderItem = "";
  batchAgencyList = [];

  expanded = "";
  public allItems: any[];
  public allItemsHistory: any[];
  public allPaymentLookupObject: any[];// for filter purpose
  pager: any = {};
  pagedItems: any[];
  //headerArrayList: any[];
  setCount: (number) => void;
  rowCountAfterFilter: any;
  loggedIn: boolean;
  firstName: string = ``;
  lastName: string = ``;
  userId: any = '';
  loginUserInfo: any;
  paymentSearchResults: any;
  allAPNResponse: any;
  encodedJwtToken: any;
  expiresIn: any;
  loadMsg: string = '';
  claims: any = {};
  totalamt: any = 0;
  pageRecordLimitData;
  pageRecordLimit = 100;
  menuNavId: any;
  paymentLookupHeaders: any = [];
  prefferedPage: any;
  users: any = [];
  installPaymentId: any;
  tokenId: any = [];
  rMessages: any = [];
  item1: any = {};
  item2: any = {};
  penaltyAmt: any = 0;
  interestAmt: any = 0;
  costAmt: any = 0;;
  taxAmtPaid: any = 0;
  selectedItem = 0;
  isFilterLimit = false;
  previousDay: any;

  setPage(pages) {
    this.selectedItem = pages;
  }
  setCost: (any) => void;
  setInterest: (any) => void;
  setTaxAmt: (any) => void;
  setPenalty: (any) => void;
  setFilterdItems: (any) => void;

  /**
  * Creates an instance of PaymentLookupComponent.
  * @param {PaymentLookupService} paymentLookupService 
  * @param {DownloadService} downloadService 
  * @memberof PaymentLookupComponent
  */
  constructor(
    public router: Router,
    private _globalService: GlobalTaxToolService,
    public commonService: CommonService,

    private orderPipe: OrderPipe,
    private formBuilder: FormBuilder,
    public paymentLookupService: PaymentLookupService,
    public downloadService: DownloadService,
    public helperCommonMethod: HelperCommonMethod,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    public _script: ScriptLoaderService,
    //  private viewAuthTokenService: ViewAuthTokenService,
  ) {
    this.installmentList = PaymentInstallmentData;
    this.batchAgencyList = BatchAgencyData;
    this.totalPages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 22];
    this.selectResultConditon = lookupDropdownData;
    this.filterTableHeaderData = lookupTableHeaderData;
    this.paymentYearList = [
      { item_id: 1, item_text: 'Current Fiscal Year' },
      { item_id: 2, item_text: 'Prior Fiscal Years' },

    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      data: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unselectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: false
    };
    this.dropdownSingleSelectSettings = {
      singleSelection: true,
      idField: 'item_id',
      data: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unselectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: false
    }
    this.paymentStatusOption = paymentStatusData;
    this.paymentSourceList = paymentSourcesData;
    this.taxTypeList = paymentTaxData;
    this.pageRecordLimitData = [100, 250, 500];
    this.setFilterdItems = items => {
      this.filteredItems = items;
      if (this.filteredItems) {
        this.costAmt = items.reduce(function (prev, cur) {
          return prev + cur.costAmount;
        }, 0);
        this.interestAmt = items.reduce(function (prev, cur) {
          return prev + cur.interestAmount;
        }, 0);
        this.taxAmtPaid = items.reduce(function (prev, cur) {
          return prev + cur.taxAmountPaid;
        }, 0);
        this.penaltyAmt = items.reduce(function (prev, cur) {
          return prev + cur.penaltyAmount;
        }, 0);
      }
      this.rowCount = items.length;
    }

  }

  public startCalenderDate;
  ngOnInit() {
    this.getProfileInfo();
    this.apnSearchFormValidationConfig();
    this.entries = this.serachTypeObject;
    if (this.entries) {
      this.onSelectionChange(this.entries[0], '');
    }
    this.loadLibrabyFileAtComponentInit();

    this.transactionlNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
    this.creditNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
    this.depositNGModal['Payment_From'] = this.FormatDateString(this.previousDay);

  }

  /**
    * Creates an instance of loadLibrabyFileAtComponentInit.
    * @description load extenal files
    * @memberof PaymentLookupComponent
    */
  private loadLibrabyFileAtComponentInit() {
    this._script.loadScripts('app-payment-lookup',
      ['https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js']);
  }
  
  TracerEnter(event)
  {
    if (event.key == 'Enter' && event.target.value.length >= 8)    
      this.getPaymentLookupSearchResult('APN & Tracer');    
  }

  private apnSearchFormValidationConfig() {
    const apnNumberVaidationPattern = "^[0-9-]+$";
    const tracerNumberVaidationPattern = "[0-9]*";
    this.apnSearchform = this.formBuilder.group({
      APNNumber: [null, [Validators.required, Validators.pattern(apnNumberVaidationPattern)]],
      tracerNumber: [null, [Validators.required, Validators.pattern(tracerNumberVaidationPattern)]],
      selectedInstallmentItems: [[]],
      rollYear:[0]
    });

  }


  isFieldValid(field: string) {
    if (!this.apnSearchform.get('APNNumber').valid && !this.apnSearchform.get('tracerNumber').valid) {
      return (
        (!this.apnSearchform.get(field).valid && this.apnSearchform.get(field).touched) ||
        (this.formSubmitAttempt)
      );
    }
  }

   getPaymentSearcHistoryResponse(trxn_id,paymentId: any) {
     this.spinnerLoading = false;
     this.paymentLookupService.getSearchHistory(trxn_id,paymentId).subscribe(data => {
       this.spinnerLoading = true;
       this.allItemsHistory = data;

       // alert(this.allItemsHistory[0].paymentStatus);
     });
   }
  // getPaymentSearcHistoryResponse(trxn_id: any) {
  //   this.spinnerLoading = false;
  //   this.paymentLookupService.getSearchHistory(trxn_id).subscribe(data => {
  //     this.spinnerLoading = true;
  //     this.allItemsHistory = data;

  //     // alert(this.allItemsHistory[0].paymentStatus);
  //   });
  // }

  getAPNSearchResults() {
    let isAllValid = true;
    if (this.apnSearchform.value.tracerNumber.length == 0 && this.apnSearchform.value.APNNumber.length == 0) {
      this.isAPNValid = true;
      return;
    }


    this.formSubmitAttempt = true;
    let hasAtleastoneValue = false;
    isAllValid = true;
    for (let key of Object.keys(this.formValidation)) {
      if (this.formValidation[key].hasValue) {
        hasAtleastoneValue = true;
        if (!this.formValidation[key].isValid) {
          isAllValid = false;
        }
      }
    }
    if (hasAtleastoneValue) {
      this.isAPNValid = false;
      if (isAllValid) {
        this.callPaymentApnAndTracerSearch();
      }
    } else {
      this.isAPNValid = true;
    }


  }

  // getAPNSearchResults() {
  //   let isAllValid = true;
  //   if (this.apnSearchform.value.tracerNumber.length == 0 && this.apnSearchform.value.APNNumber.length == 0)  
  //   {       
  //     isAllValid = false; 
  //     this.formSubmitAttempt = true;
  //   } 
  //   else
  //     this.callPaymentApnAndTracerSearch();
  // }



  private apnFocus(value, object) {
    object['value'] = value;
    if (value) {
      object['hasValue'] = true;
      this.isAPNValid = false;
      if (value.length >= 5) {
        this.apnLengthValidation = true;
        this.isAPNLengthValid = false;
        object['isValid'] = true;
      } else {
        object['isValid'] = false;
        this.isAPNLengthValid = true;
      }
    } else {
      object['hasValue'] = false;
      object['isValid'] = false;
      this.isAPNLengthValid = false;
    }

  }

  private tracerFocus(value, object) {
    object['value'] = value;
    if (value) {
      object['hasValue'] = true;
      this.isAPNValid = false;
      if (value.length >= 8) {
        object['isValid'] = true;
        this.isTracerLengthValid = false;
      } else {
        object['isValid'] = false;
        this.apnLengthValidation = true;
        this.isTracerLengthValid = true;
      }
    } else {
      object['hasValue'] = false;
      object['isValid'] = false;
      this.isTracerLengthValid = false;
    }
  }

  private apnFormValidation(event, object, key) {
    switch (key) {
      case 'apn':
        this.apnFocus(event.target.value, object)
        break;
      case 'tracer':
        this.tracerFocus(event.target.value, object)
        break;
    }
  }



  /**
* 
* @method setOrder 
* @deprecated sort table colimn 
* @param {any} skip 
* @memberof PaymentLookupComponent
*/
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }


  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }



  resetForm(focus) {
    this.totalLength = 0;
    this.selectedtableHeader = '';
    this.isFilterLimit=false;    
    this.apnSearchform.reset({
      APNNumber: "",
      selectedInstallmentItems: [],
      tracerNumber: ""
    });
    this.resetSeachCriteriaNgModel();
    this.isAPNLengthValid = false;
    this.isAPNValid = false;
    this.isTracerLengthValid = false;
    if (this.allAPNResponse) {
      this.allAPNResponse.item2 = "";
    }
    this.formSubmitAttempt = false;
    focus.focus();

    this.formValidation['apnNumber']['value'] = '';
    this.formValidation['tracerNumber']['value'] = '';

    // this.selectedEntry.description = 'APN & Tracer';
  }



  private getTableColumnList(headerColumnObject) {
    const tableHeaderArrayList = [];
    for (var selItem of headerColumnObject) {
      for (var item of this.filterTableHeaderData) {
        if (selItem === item.item_id) {
          tableHeaderArrayList.push({
            "item_id": item.item_id,
            "item_text": item.item_text,
            // "value": item.value,
          });
        }
      }
    }
    //  alert("" +tableHeaderArrayList);
    return tableHeaderArrayList;
  }


  // getProfileInfo() {
  //   this._globalService.getData().subscribe(_item => {
  //     const myProfileInfo = _item;


  //     this.filterTableHeaderData = this.getTableColumnList(myProfileInfo['paymentLookupHeaders']);
  //     this.paymentLookupHeaders = myProfileInfo['paymentLookupHeaders'];
  //     this.previousDay = myProfileInfo['previousDay'];
  //   })
  // }

  getProfileInfo() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    this.filterTableHeaderData = this.getTableColumnList(myProfileInfo['paymentLookupHeaders']);
    this.paymentLookupHeaders = myProfileInfo['paymentLookupHeaders'];
    this.previousDay = myProfileInfo['previousDay'];

  }

  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);

    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }


  /**
  * 
  * @method downloadCSV 
  * @deprecated for download the csv template
  * @param {any} skip getLookupSearchResult
  * @memberof PaymentLookupComponent
  */
  downloadCSV(skip) {

    //  let exportHeaders = this.paymentLookupHeaders;
    console.log('test');
    let exportHeaders = this.getTableColumnList(this.paymentLookupHeaders);
    exportHeaders.push({
      item_id: "sortAPN",
      item_text: "sortAPN"
    });

    const totalAmount = this.taxAmtPaid + this.penaltyAmt + this.interestAmt + this.costAmt;
    const taxToolReportTotal =
      {

        "taxAmountPaid": this.taxAmtPaid,
        "totalAmount": totalAmount,
        "penaltyAmount": this.penaltyAmt,
        "interestAmount": this.interestAmt,
        "costAmount": this.costAmt
      };

    this.filteredItems.push(taxToolReportTotal);
    console.log(JSON.stringify( this.filteredItems));
    this.filteredItems = this.filteredItems.map(item => {
      if (item.paymentStatus) {
        // var PS = new Date(item.paymentStatus);
        item.paymentStatus = item.paymentStatus.split('–').join('-');
      } 
     
     if (item.transactionDate) {
        var date = new Date(item.transactionDate);
        item.transactionDate = date.toLocaleDateString().split('/').join('-');
      }
      if (item.createdDate) {
        var date = new Date(item.createdDate);
        item.createdDate = date.toLocaleDateString().split('/').join('-');
      }
      if (item.creditDate) {
        var date = new Date(item.creditDate);
        item.creditDate = date.toLocaleDateString().split('/').join('-');
      }
      if (item.depositDate) {
        var date = new Date(item.depositDate);
        item.depositDate = date.toLocaleDateString().split('/').join('-');
      }
      return item;
    })

    let csvData = this.downloadService.ConvertToCSV(this.filteredItems, exportHeaders);
this.downloadService.getBlobCSVData(csvData);
  }

  /**
  * 
  * @method getPaymentLookupData 
  * @description call API for get payment lookup data
  * @param {any} data 
  * @memberof PaymentLookupComponent
  */
  public getPaymentLookupData(data) {

    this.paymentLookupService.get().subscribe(response => {
      data(JSON.parse(response._body));
    },
      (err) => {
        // console.log('get payment lookup error', err);
      });
  }

  /**
* tableDragger
* @method returnDateISObject
* @description retunt selected date from datepicker and format date into mm/dd/yyy
* @param dateObject
* @memberof PaymentLookupComponent
*/
  public returnDateISObject(dateObject) {

    if (dateObject) {
      var selectedDate;
      if (typeof dateObject == "object") {
        var formatDate = this.isCorrectDate(dateObject);
        var formatDay = (dateObject['day'] < 9) ? '0' + dateObject['day'] : dateObject['day'];
        var formatMonth = (dateObject['month'] < 9) ? '0' + dateObject['month'] : dateObject['month'];
        selectedDate = formatMonth + '/' + formatDay + '/' + dateObject['year'];
        return selectedDate;
      }
      else {
        selectedDate = this.isCorrectDate(dateObject);
        return dateObject;
      }
    }

  }
  private hideErrorMsgFunction() {
    this.isDateFormatWrong = false;
    this.isAPNValid = false;
    this.isAPNLengthValid = false;
    this.isTracerLengthValid = false;
  }


  /**
 * tableDragger
 * @method getCurrentData
 * @description return current date in mm/dd/yyy fromat
 
 * @memberof PaymentLookupComponent
 */
  public getCurrentData() {
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    var today: any = mm + '/' + dd + '/' + yyyy;
    return today;
  }
  /**
  * tableDragger
  * @method getPaymentLookupSearchResult
  * @description for search payment lookup based on key type
  * @param {any} searchType 
  * @memberof PaymentLookupComponent
  */

  getPaymentLookupSearchResult(searchType) {
    this.p=1;
    this.reverse = false;
    this.paymentSearchResults = [];
    this.order = 'null';
    this.expanded = null;
    $("#clscroll-content").animate({ scrollTop: 0 }, 'slow');
    this.isTotalsNotAddedToCSV = true;
    switch (searchType) {
      case 'APN & Tracer':
        this.getAPNSearchResults();
        break;
      case 'Transaction Dates':
        this.getDateSearchResponse(this.transactionlNGModal, searchType);
        break;
      case 'Credit Dates':
        this.getDateSearchResponse(this.creditNGModal, searchType);
        break;
      case 'Deposit Dates':
        this.getDateSearchResponse(this.depositNGModal, searchType);
        break;
    }

  }


  // getAPNSearchResultsold() {
  //   this.formSubmitAttempt = true;
  //   if (this.apnSearchform.value.APNNumber != '' || this.apnSearchform.value.tracerNumber != '') {

  //     if ((this.apnSearchform.value.APNNumber != '') && (this.apnSearchform.value.tracerNumber == '')) {
  //       if (this.apnSearchform.value.APNNumber.length >= 5) {
  //         this.isAPNLengthValid = false;
  //         this.callPaymentApnAndTracerSearch();
  //       } else {
  //         this.isAPNValid = false;
  //         this.isAPNLengthValid = true;
  //         this.isTracerLengthValid = false;
  //       }
  //     } else if ((this.apnSearchform.value.tracerNumber != '') && (this.apnSearchform.value.APNNumber == '')) {
  //       if (this.apnSearchform.value.tracerNumber.length >= 8) {
  //         this.isTracerLengthValid = false;
  //         this.callPaymentApnAndTracerSearch();
  //       } else {
  //         this.isAPNLengthValid = false;
  //         this.isAPNValid = false;
  //         this.isTracerLengthValid = true;
  //       }
  //     } else if ((this.apnSearchform.value.tracerNumber != '') && (this.apnSearchform.value.APNNumber != '')) {
  //       if (this.apnSearchform.value.APNNumber.length >= 5) {
  //         if (this.apnSearchform.value.tracerNumber.length >= 8) {
  //           this.isAPNLengthValid = false;
  //           this.isTracerLengthValid = false;
  //           this.isAPNValid = false;
  //           this.callPaymentApnAndTracerSearch();
  //         } else {
  //           this.isAPNValid = false;
  //           this.isAPNLengthValid = false;
  //           this.isAPNValid = false;
  //           this.isTracerLengthValid = true;
  //         }
  //       } else {
  //         this.isAPNValid = false;
  //         this.isAPNLengthValid = true;
  //         this.isTracerLengthValid = false;
  //       }
  //     }
  //   } else {
  //     this.isAPNValid = true;
  //   }
  // }


  callPaymentApnAndTracerSearch() {
    this.isAPNValid = false;

    let postData = {
      apn: this.apnSearchform.value.APNNumber,
      tracerNo: this.apnSearchform.value.tracerNumber,
      installmentNo: this.getSelectedItemInArrayFormat(this.apnSearchform.value.selectedInstallmentItems),
      rollYear:Number(this.apnSearchform.value.rollYear) ? Number(this.apnSearchform.value.rollYear) :0
    }
    this.spinnerLoading = false;
    this.paymentLookupService.postSearchByApnNoInfo(postData).subscribe(responseData => {
      this.populateData(responseData);
    });
  }



  private getDateSearchResponse(DateSearchModel: any, searchType: string) {
    var formatDate = this.returnDateISObject(DateSearchModel['Payment_From']);
    var formatDateTo = this.returnDateISObject(DateSearchModel['Payment_To']);
    if (DateSearchModel['Payment_From'] || DateSearchModel['Payment_To']) {

      if (DateSearchModel['Payment_From']) {
        this.isMandatoryWrong = false;
        if (this.isCorrectDate(formatDate)) {
          this.isDateFormatWrong = false;
          if (new Date(this.getCurrentData()) >= new Date(formatDate)) {
            this.isToDate = false;
            var paymentFromDate = formatDate = this.returnDateISObject(DateSearchModel['Payment_From']);

            this.isDateFormatWrong = false;
            if (DateSearchModel['Payment_From']) {

              if (DateSearchModel['Payment_To']) {
                if (this.isCorrectDate(formatDateTo)) {
                  this.isFromToDateFormatWrong = false;
                  if (new Date(formatDate) <= new Date(formatDateTo)) {
                    this.isDateGreatherLessThanFromDate = false;
                    this.isFilterLimit = false;
                    let trnsactionPostData = {
                      Payment_From: formatDate,
                      Payment_To: formatDateTo,
                      payment_Status: this.getSelectedItemInArrayFormat(DateSearchModel['Payment_Status']),
                      payment_Source: this.getSelectedItemInArrayFormat(DateSearchModel['payment_Source']),
                      t_type: this.getSelectedItemInArrayFormat(DateSearchModel['t_type']),
                    }
                    this.spinnerLoading = false;

                    if (searchType === 'Transaction Dates') {
                      this.paymentLookupService.postSearchTransactionInfo(trnsactionPostData).subscribe(data => {
                        this.populateData(data);
                      });
                    }

                    if (searchType === 'Credit Dates') {
                      this.paymentLookupService.postSearchCreditDateInfo(trnsactionPostData).subscribe(data => {
                        this.populateData(data);
                      });
                    }

                    if (searchType === 'Deposit Dates') {
                      this.paymentLookupService.postSearchDepositDateInfo(trnsactionPostData).subscribe(data => {
                        this.populateData(data);
                      });
                    }
                  }
                  else {
                    this.isDateGreatherLessThanFromDate = true;
                  }
                }
                else {
                  this.isFromToDateFormatWrong = true;
                }
              } else {
                this.isFilterLimit = false;
                let trnsactionPostData = {
                  Payment_From: formatDate,
                  Payment_To: formatDateTo,
                  payment_Status: this.getSelectedItemInArrayFormat(DateSearchModel['Payment_Status']),
                  payment_Source: this.getSelectedItemInArrayFormat(DateSearchModel['payment_Source']),
                  t_type: this.getSelectedItemInArrayFormat(DateSearchModel['t_type']),
                  //  pageNo: 1
                }
                this.spinnerLoading = false;
                if (searchType === 'Transaction Dates') {
                  this.paymentLookupService.postSearchTransactionInfo(trnsactionPostData).subscribe(data => {
                    this.populateData(data);
                  });
                }

                if (searchType === 'Credit Dates') {
                  this.paymentLookupService.postSearchCreditDateInfo(trnsactionPostData).subscribe(data => {
                    this.populateData(data);
                  });
                }

                if (searchType === 'Deposit Dates') {
                  this.paymentLookupService.postSearchDepositDateInfo(trnsactionPostData).subscribe(data => {
                    this.populateData(data);
                  });
                }
              }
            } else {
              this.isToDate = true;
              this.isFilterLimit = false;
            }
          } else {
            this.isToDate = true;
            this.isFilterLimit = false;
          }

        } else {
          this.isDateFormatWrong = true;
          this.isFilterLimit = false;
          this.isMandatoryWrong = false;
        }
      } else {
        this.isMandatoryWrong = true;
        this.isFilterLimit = false;
        this.isDateFormatWrong = false;
      }

    } else {
      this.isMandatoryWrong = true;
      this.isDateFormatWrong = false;
      this.isFilterLimit = false;
    }

  }

  populateData(responseData: any) {
    this.spinnerLoading = true;
    // this.allAPNResponse = responseData
    // this.paymentSearchResults = this.allAPNResponse.item1;
    // this.allItems = this.allAPNResponse.item1;
    this.item2 = responseData.item2;
    this.totalLength = responseData['item1'].length;
    // this.cdRef.detectChanges();
    if (responseData.item2 == "success" || responseData.item1.length > 0) {
      this.isFilterLimit = true;
      if (responseData.item2 == "success")
        this.isFilterLimit = false;
      this.paymentSearchResults = responseData.item1;
      this.getLookupSearchResult = responseData.item1;
      this.allPaymentLookupObject = responseData.item1;
      this.allItems = responseData.item1;
      if (this.paymentSearchResults != null) {
        for (let i = 0, taxamt: any; i < responseData.item1.length; i++) {
          this.penaltyAmt = this.penaltyAmt + this.paymentSearchResults[i].penaltyAmount;
          this.interestAmt = this.interestAmt + this.paymentSearchResults[i].interestAmount;
          this.costAmt = this.costAmt + this.paymentSearchResults[i].costAmount;
          this.taxAmtPaid = this.taxAmtPaid + this.paymentSearchResults[i].taxAmountPaid;
        }
      }
      this.verticalHorizontalScrollConfig();
    } else {
      this.isFilterLimit = true;
    }
  }



  /**
  * 
  * @method isCorrectDate 
  * @description Check Date Validation code and return true or false
  * @param {any} date Post date 
  * @memberof PaymentLookupComponent
  */
  public isCorrectDate(date) {

    var regex = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{4})*$/;

    return (regex.test(date));

  }
  /**
  * 
  * @method getAPNPaymentLookupResponse 
  * @description call API for get payment lookup data
  * @param {any} data Post data 
  * @memberof PaymentLookupComponent
  */
  public getAPNPaymentLookupResponse(data) {
    this.paymentLookupService.getAPNPaymentLookupResponse(data).subscribe(response => {
      // data(response.data);
      this.allPaymentLookupObject = response.data;
      this.allItems = response.data;
      this.totalLength = this.allItems.length;
      this.cdRef.detectChanges();
    },
      (err) => {
        // console.log('get APNPayment lookup error', err);
      });
  }

  /**
* 
* @method getSelectedItemInArrayFormat
* @param {any} ngModelObject 
* @description return NgModel selected value as array of list
* @memberof PaymentLookupComponent
*/
  private getSelectedItemInArrayFormat(ngModelObject) {
    var splitedNgModel = [];
    if (typeof ngModelObject !== 'undefined' && ngModelObject.length > 0) {
      for (let i = 0; i < ngModelObject.length; i++) {
        splitedNgModel.push(ngModelObject[i]['item_id'])
      }
      return splitedNgModel;
    }
    else {
      return splitedNgModel;
    }
  }
  /**
  * 
  * @method pageChangeData
  * @param {any} $event 
  * @description pageChagedata Output decorator to listen page data
  * @memberof PaymentLookupComponent
  */
  pageChangeData($event) {
    setTimeout(() => {
      this.expanded = "0";
      this.getLookupSearchResult = $event;
    })
  }
  getPaymentSearchResult() {
    // console.log(this.paymentFiscalNGModal);
  }

  private checkDate(date) {
    if (date.toString().startsWith('0001'))
      return false;
    else
      return true;
  };

  /**
 * @method resetSearchOption
 * @description Click on reset button reset ngMOdal value to empty 
 * @param key
 */
  private resetSearchOption(key, searchTableHeader) {
    //this.isFilterLimit=false;
    if (searchTableHeader) {
      this.isDateFormatWrong = false;
      this.isMandatoryWrong = false;
      this.isFilterLimit = false;
      this.isToDate = false;
      this.isFromToDateFormatWrong = false;
      this.totalLength = 0;
      if (this.allAPNResponse) {
        this.allAPNResponse.item2 = "";
      }
      if (typeof searchTableHeader == "object") {
        searchTableHeader.selectedItem = [];
        searchTableHeader.selectedItems = [];
      }
      this.getLookupSearchResult = [];
      this.allPaymentLookupObject = [];
      this.filteredItems = [];
      this.selectedtableHeader = '';
      this.resetSeachCriteriaNgModel();
      switch (key) {
        // case 'APN & Tracer':
        //   // this.helperCommonMethod.resetNGModalValue(this.angNGModal);
        //   break;
        case 'Transaction Dates':
          // delete this.transactionlNGModal['Payment_From'];
          this.helperCommonMethod.resetNGModalValue(this.transactionlNGModal);
          // this.ngbDatepickerPopup.clearNGModer();
          this.transactionlNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
          break;
        case 'Credit Dates':
          delete this.creditNGModal['Payment_From'];
          this.helperCommonMethod.resetNGModalValue(this.creditNGModal);
          this.creditNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
          break;
        case 'Deposit Dates':
          delete this.depositNGModal['Payment_From'];
          this.helperCommonMethod.resetNGModalValue(this.depositNGModal);
          this.depositNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
          break;
        // case 'Payment Fiscal Year':
        //   this.helperCommonMethod.resetNGModalValue(this.paymentFiscalNGModal);
        //   break;
        // case 'Tax Bill Fiscal Year':
        //   this.helperCommonMethod.resetNGModalValue(this.TaxFiscalNGModal);
        //   break;
      }
    }
  }

  public resetSeachCriteriaNgModel() {
    this.p=1;
    this.dt = '';
    this.selectedSignKey = '';
    this.apnKey = '';
    this.updatedByKey = '';
    this.paymentfiscalyearKey = '';
    this.batchNoKey = '';
    this.checkhNoKey = '';
    this.tellerNoKey = '';
    this.tracerNoKey = '';
    this.ncrNoSearchKey = '';
    this.taxBillYearSearchKey = '';
    this.searchInstallmentSearchKey = '';
    this.paymentStatusSearchKey = '';
    this.paymentReasonSearchKey = '';
    this.paymentSourceSearchKey = '';
    this.paymentTaxTypeSearchKey = '';
    this.paymentMethodSearchKey='';
    this.methodTypeSearchKey='';
  }
   public toggleRow(index, billId,paymentId, type) {
    if (type == 'expand') {
       this.getPaymentSearcHistoryResponse(billId,paymentId);
      //this.getPaymentSearcHistoryResponse(billId);
      this.expanded = (this.expanded !== index) ? index : "";
    } else {
      this.expanded = (this.expanded !== index) ? index : "";
    }

  }



  /**
   * @method falseValidationMsg
   * @description false all validation msg once tab change
   *  
   *   */
  private falseValidationMsg() {
    this.isFieldValidCheck = false;
    this.isTaxFieldValidCheck = false;
    this.isDateFormatWrong = false;
    this.isMandatoryWrong = false;
    this.isToDate = false;
    this.isDateGreatherLessThanFromDate = false;
    this.isFromToDateFormatWrong = false;
  }
  /**
  * @method onSelectionChange
  * @param entry,searchTableHeader
  * @description radio button selection 
  *  
  *   */
  public onSelectionChange(entry, searchTableHeader) {
    this.startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate(), year: new Date().getFullYear() };

    if (typeof searchTableHeader == "object") {
      searchTableHeader.selectedItem = [];
      searchTableHeader.selectedItems = [];
    }
    this.isFilterLimit = false;
    this.isAPNValid = false;
    this.isAPNLengthValid = false;
    this.isTracerLengthValid = false;
    //   this.filterTableHeaderData = lookupTableHeaderData;
    this.selectedtableHeader = '';
    this.falseValidationMsg();
    // clone the object for immutability
    setTimeout(() => {
      this.spinnerLoading = true;
      this.getLookupSearchResult = [];
      this.totalLength = 0;
      this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
    }, 500);
    this.formSubmitAttempt = false;
    this.apnSearchform.reset({
      APNNumber: "",
      selectedInstallmentItems: [],
      tracerNumber: ""

    });
    this.resetSearchOption(entry.description, null);
    this.onHeaderSelect(entry.description);
    this.spinnerLoading = false;
    //this.getFilterDateJsonObject('', entry.description)
    this.depositPaymentToDate = this.FormatDateString(this.previousDay);

    this.transactionlNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
    this.creditNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
    this.depositNGModal['Payment_From'] = this.FormatDateString(this.previousDay);
    this.transactionlNGModal['Payment_To'] = '';
    this.creditNGModal['Payment_To'] = '';
    this.depositNGModal['Payment_To'] ='';
  }
  public onTransactionDateSelectNotify(date, datePikcerType) {
    switch (datePikcerType) {
      case 'Payment_From':
        this.transactionlNGModal['Payment_From'] = date;
        break;
      case 'Payment_To':
        this.transactionlNGModal['Payment_To'] = date;
        break;
    }
  }

  public routeToPaymentCorrection(object) {
    console.log('object',object);
    if (this.transactionlNGModal['payment_Source'].length > 0) {
      object['type'] = this.transactionlNGModal['payment_Source'];
    } else if (this.creditNGModal['payment_Source'].length > 0) {
      object['type'] = this.creditNGModal['payment_Source'];
    } else {
      if (this.depositNGModal['payment_Source'].length > 0) {
        object['type'] = this.depositNGModal['payment_Source'];
      }
    }
    this.commonService.savePaymentDetail(object);

    this.router.navigate(['/paymentcorrection'],{ queryParams: { page: 'payment' }});
  }

  /**
   * @method routeToReappyPayment
   * @param selectedPaymentObject 
   * @description click on re-apply payment route to re-apply page and save selected object in common service 
   */
  public routeToReappyPayment(selectedPaymentObject) {
    if (selectedPaymentObject) {
      this.commonService.savePaymentDetail(selectedPaymentObject);
      this.router.navigate(['/reapplypayment']);
    }
  }
  public onDepositDateSelectNotify(date, datePikcerType) {
    switch (datePikcerType) {
      case 'Payment_From':
        this.depositNGModal['Payment_From'] = date;
        break;
      case 'Payment_To':
        this.depositNGModal['Payment_To'] = date;
        break;
    }
  }



  public onCreditDateSelectNotify(date, datePikcerType) {
    switch (datePikcerType) {
      case 'Payment_From':
        this.creditNGModal['Payment_From'] = date;
        break;
      case 'Payment_To':
        this.creditNGModal['Payment_To'] = date;
        break;
    }
  }
  onItemSelect(item: any) {
    this.isFieldValidCheck = false;
    this.isTaxFieldValidCheck = false;
    this.isTransactionValidCheck = false;
  }

  onHeaderSelect(item: any) {
    if (this.filterType) {
      this.paymentSearchResults = this.allItems;
      this.totalAmountKey = '';
      this.selectedSignKey = '';
    }
    this.dt = '';
    this.selectedSignKey = '';
    this.apnKey = '';
    this.updatedByKey = '';
    this.paymentfiscalyearKey = '';
    this.batchNoKey = '';
    this.checkhNoKey = '';
    this.tellerNoKey = '';
    this.tracerNoKey = '';
    this.ncrNoSearchKey = '';
    this.taxBillYearSearchKey = '';
    this.searchInstallmentSearchKey = '';
    this.paymentStatusSearchKey = '';
    this.paymentReasonSearchKey = '';
    this.paymentSourceSearchKey = '';
    this.paymentTaxTypeSearchKey = '';
    this.paymentSearchResults = this.allItems;
    this.selectedHeaderItem = item.item_id;
    this.batchAgencySearchKey = '';
    this.supplementalTypeSearchKey = '';
    this.methodTypeSearchKey = '';
    //this.getFilterDateJsonObject('', item)
  }
  onSelectAll(items) {
    //console.log(items);
  }
  ngAfterViewInit() {
    document.getElementById('spinner_loader').classList.add('hide');
    this.verticalHorizontalScrollConfig();
  }


  /**
 * @method verticalHorizontalScrollConfig
 * @description Scroll configuration
 * @memberof PaymentLookupComponent
 */
  private verticalHorizontalScrollConfig() {
    $("#clscroll-content").scroll(function () {
      $("#clscroll-row-headers").scrollTop($("#clscroll-content").scrollTop());
      // console.log("left");
      $("#clscroll-column-headers").scrollLeft($("#clscroll-content").scrollLeft());
    });

    $("#clscroll-column-headers").scroll(function () {
      $("#clscroll-content").scrollLeft($("#clscroll-column-headers").scrollLeft());
    });

    $("#clscroll-row-headers").scroll(function () {
      // $("#clscroll-content").scrollTop($("#clscroll-row-headers").scrollTop());
    });
  }
  /**
  * @method addDropDownICon
  * @description aadd icon to select plugin
  * @memberof PaymentLookupComponent
  */
  addDropDownICon() {
    let htmlElement = document.getElementsByClassName('glyphicon');
    for (let i = 0; i < htmlElement.length; i++) {
      htmlElement[i].className += " " + "fa fa-angle-down"
    }
  }


  /**
  * 
  * @method filterByDate 
  * @param {*} inputValue 
  * @param {any} selectedHeaderItemKey 
  * @memberof PaymentLookupComponent
  */
  filterByDate(inputValue: any, selectedHeaderItemKey) {
    switch (selectedHeaderItemKey) {
      case 'transactionDate':
        this.getFilterDateJsonObject(inputValue, selectedHeaderItemKey);
        break;
      case 'creditDate':
        this.getFilterDateJsonObject(inputValue, selectedHeaderItemKey);
        break;
      case 'createdDate':
        this.getFilterDateJsonObject(inputValue, selectedHeaderItemKey);
        break;
      case 'depositDate':
        this.getFilterDateJsonObject(inputValue, selectedHeaderItemKey);
        break;
    }

  }

  /**
  * 
  * @method getFilterDateJsonObject
  * @description filter date based on key type
  * @param {any} inputValue 
  * @param {any} key date1.substr(0, date1.indexOf('T'))
  * @memberof PaymentLookupComponent
  */
  // public getFilterDateJsonObject(inputValue, key) {
  //   if (inputValue != null || inputValue == "undefined" || inputValue == undefined) {
  //     let monthFormat;
  //     this.spinnerLoading = false;
  //     setTimeout(() => {
  //       let dayFormat;
  //       if (inputValue.day < 9) {
  //         dayFormat = '0' + inputValue.day;
  //         monthFormat = '0' + inputValue.month;
  //       }
  //       else {
  //         dayFormat = inputValue.day;
  //         monthFormat = inputValue.month;
  //       }
  //       let filterDateFormat = inputValue.year + '-' + dayFormat + '-' + monthFormat;
  //       if (filterDateFormat == undefined || filterDateFormat == "undefined-undefined-undefined") {
  //         this.spinnerLoading = true;
  //         this.paymentSearchResults = this.allItems;
  //         this.filteredItems = this.paymentSearchResults;
  //       } else {
  // this.spinnerLoading = true;
  //         this.paymentSearchResults = this.allPaymentLookupObject.filter(object => {
  //          
  //           if (typeof object[key] == "string") {
  //             return object[key].substring(0, object[key].indexOf("T")).includes(filterDateFormat);
  //           } else {
  //             return object[key].substring(0, object[key].indexOf("T")).includes(filterDateFormat);
  //           }
  //         })
  //         this.filteredItems = this.paymentSearchResults;
  //       }
  //     }, 10);

  //   }
  // }

  public getFilterDateJsonObject(inputValue, key) {
    if (!inputValue || typeof inputValue === 'string') {
      this.paymentSearchResults = this.allPaymentLookupObject
      return
    }

    const dateToFilter = new Date(inputValue.year, inputValue.month - 1, inputValue.day)

    this.paymentSearchResults = this.allPaymentLookupObject.filter(object => {
      const comparisonDateString = object[key]
      if (!comparisonDateString) {
        return false
      } else {
        const comparisonDate = new Date(comparisonDateString)
        return comparisonDate.getTime() === dateToFilter.getTime()
      }
    });

    this.filteredItems = this.paymentSearchResults;

    return;
  }



  /**
  * 
  * @method filterTotalAmountData 
  * @param {*} inputValueKey
  * @param {any} key
  * @param type
  * @description filter data based on condition
  * @memberof PaymentLookupComponent
  */
  filterTotalAmountData(inputValueKey, key, type, selectedType) {
    this.filterType = type;
    let inputValue = Number(key);
    //  const jsonKeys = ['totalAmount', 'taxAmountPaid', 'penaltyAmount', 'interestAmount', 'costAmount', 'overage'];
    switch (selectedType) {
      case "totalAmount":
        this.getReturnAllFilterData(inputValueKey, key, type, selectedType);
        break;
      case "taxAmountPaid":
        this.getReturnAllFilterData(inputValueKey, key, type, selectedType);
        break;
      case "penaltyAmount":
        this.getReturnAllFilterData(inputValueKey, key, type, selectedType);
        break;
      case "interestAmount":
        this.getReturnAllFilterData(inputValueKey, key, type, selectedType);
        break;
      case "costAmount":
        this.getReturnAllFilterData(inputValueKey, key, type, selectedType);
        break;
      case "returnCheckFee":
        this.getReturnAllFilterData(inputValueKey, key, type, selectedType);
        break;
    }

  }
  getReturnAllFilterData(inputValueKey, key, type, selectedType) {
    switch (inputValueKey.item_id) {
      case "=":
        var filterDataObjects = this.allPaymentLookupObject.filter(object => {
          if (key == object[selectedType]) {
            return object;
          }
        });
        this.paymentSearchResults = filterDataObjects;
        break;
      case ">":
        var filterDataObjects = this.allPaymentLookupObject.filter(object => {
          if (object[selectedType] > key) {
            return object;
          }
        });
        this.paymentSearchResults = filterDataObjects;
        break;
      case "<":
        var filterDataObjects = this.allPaymentLookupObject.filter(object => {
          if (object[selectedType] < key) {
            return object;
          }
        });
        this.paymentSearchResults = filterDataObjects;
        break;
      case ">=":
        var filterDataObjects = this.allPaymentLookupObject.filter(object => {
          if (object[selectedType] >= key) {
            return object;
          }
        });
        this.paymentSearchResults = filterDataObjects;
        break;
      case "<=":
        var filterDataObjects = this.allPaymentLookupObject.filter(object => {
          if (object[selectedType] <= key) {
            return object;
          }
        });
        this.paymentSearchResults = filterDataObjects;
        break;
      case "!=":
        var filterDataObjects = this.allPaymentLookupObject.filter(object => {
          if (key != object[selectedType]) {
            return object;
          }
        });
        this.paymentSearchResults = filterDataObjects;
        break;
    }
    this.filteredItems = this.paymentSearchResults;
  }


}

