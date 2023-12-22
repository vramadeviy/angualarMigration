
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { PaymentCorrectionService } from './payment-correction.service';
import { CommonService } from '../_service/common.service';

import { PaymentCorrectionSearch } from './payment-correction-model'
import { PaymentDetailModal } from './payment-correction-data/payment-detail.modal'

import { BatchAgencyData } from '../payment-lookup/payment-lookup-data/batch-agency-data'
import { PaymentInstallmentData } from '../payment-lookup/payment-lookup-data/payment-lookup-Installment-data'
import { InfoAlertMessages } from '../shared/Info-alert-messages.data';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalTaxToolService } from '../_service/global-taxtools-service';
declare var $: any;
@Component({
  selector: 'app-payment-correction',
  templateUrl: './payment-correction.component.html',
  styleUrls: ['./payment-correction.component.scss'],
  providers: [PaymentCorrectionService],
  encapsulation: ViewEncapsulation.None
})

export class PaymentCorrectionComponent implements OnInit {
  public infoAlertMessages = InfoAlertMessages;
  public batchAgencyList = [];                        // hold batch ageny array of Object
  public newBatchAgencyName;
  public batchAgencyName;
  public batchAgencyNameTemp;

  public search = new PaymentCorrectionSearch();        // create search object for search form 
  public paymentCorrectionResponse;
  // hold payment correction search response result
  public isPaymentCorrectionResponseResult: boolean;   // keep track for search result -(return boolean)
  public paymentDetailModal = new PaymentDetailModal();   // hold payment detail form ng model keys
  public isBatchAgencyReadOnly = true;// hold batch agency read property
  public isSaveButtonDisable = true;
  public selReason; // hold payment reson ngmodel key
  public isEditable;
  taxdetail = {};
  public batchAgencyUpdateMeg; // update batch agnecy msg form backend side
  paymentId; // To store payment ID to hide multiple payment correction records
  dropdownSingleSelectSettings = {
    singleSelection: true,
    idField: 'item_id',
    data: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unselectAllText: 'Unselect All',
    itemsShowLimit: 1,
    allowSearchFilter: false
  }
  public installmentType = [
    { item_id: 1, item_text: 'Install 1' },
    { item_id: 2, item_text: 'Install 2' },
  ];
  // public rollYearList = [
  //   { item_id: 2020, item_text: '2020' },
  //   { item_id: 2019, item_text: '2019' },
  // ];

  // hold installment type;
  submitted: boolean;
  responseResult1: any;
  editPayment: boolean;
  isSaveFailed = false;
  routerParams;
  paymentCorrectionSearchDetails: any;
  paymentCorrectionDetails: any;
  paymentCorrectionLinks: any;
  isPaymentCorrectionPageSaved: any;
  isPaymentCorrectionFlag: boolean = false;
  private unsubscribe: Subject<void> = new Subject<void>();
  selectedIndex;
  public isOnChnagePaymentCorrection;
  public paymentCorrectionSelectedObject: any = {};
  public paymentCorrectionSelectedObjectIndex;
  public selectedCorrectionOption;
  constructor(
    public commonService: CommonService,
    private route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    private _globalService: GlobalTaxToolService,
    public paymentCorrectionService: PaymentCorrectionService) {
    const loginData = this._globalService.getData();
    this.search.rollYear = loginData['currentRollYear'];
  }

  ngOnInit() {
    this.getActivatedRouteParams();
    this.getSelectedPaymentDetails();
  }

  // Added Route  
  getActivatedRouteParams() {
    this.route.queryParams
      .subscribe(params => {
        this.routerParams = params['page'];
      });
  }
  private getSelectedPaymentDetails() {
    this.commonService.getPaymentDetail().takeUntil(this.unsubscribe).subscribe(response => {
      if (response && !this.isEmpty(response)) {
        let routinParam = {
          "rollYear": response.paymentFiscalYear,
          "tracerNo": response.tracerNo,
          "installNo": response.installNo,
          "installPaymentId": response.installPaymentId
        }
        this.search = routinParam;
        this.isBatchAgencyReadOnly = true;
        if(routinParam.installPaymentId == null)
        {
          this.getPaymentCorrectionSearchResult(routinParam);
        }
        else
        {
          this.getPaymentCorrectionSearchResultInit(routinParam);
        }
        
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.savePaymentDetail(null);
  }

  public totalAmount;

  public calculateTotal(taxAmount, penaltyAmount, interestAmount, costAmount) {
    let tax_amount = taxAmount ? taxAmount : '0';
    let penalty_amount = penaltyAmount ? penaltyAmount : '0';
    let interest_amount = interestAmount ? interestAmount : '0';
    let cost_amount = costAmount ? costAmount : '0';

    let total = Number(tax_amount) + Number(penalty_amount) + Number(interest_amount) + Number(cost_amount);
    return Number((total).toFixed(2));
  }

  OnChangeReason(value: any, index: any) {
    // this.calculateTotal(index);
    this.selectedCorrectionOption = value;
    this.isSaveButtonDisable = true;
    this.isPaymentCorrectionFlag = false;
    this.selectedIndex = index;
    if (value != "Select Correction") {
      this.isSaveButtonDisable = false;
    }
    //enable or disable batch agency drop down
    if (value == 'Edit Payment' || value === "Change Batch Agency") {
      this.paymentCorrectionSelectedObjectIndex = index;
      this.paymentCorrectionSelectedObject = Object.assign({}, this.paymentCorrectionResponse.paymentCorrectionDetails[index]);
      this.isOnChnagePaymentCorrection = 'Edit Payment';
      if (value === "Change Batch Agency") {
        this.getBatchAgencyList();
        this.isBatchAgencyReadOnly = false;
      }
      else {
        this.isBatchAgencyReadOnly = true;
      }
    }
    else {
      this.isBatchAgencyReadOnly = true;//}

      if (this.isOnChnagePaymentCorrection == 'Edit Payment') {
        $('#save-correction-reason').modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
        });
        this.isOnChnagePaymentCorrection = '';
      }
    }

    //enable save button for 
    var isReasonSelected = this.paymentCorrectionResponse.paymentCorrectionDetails
      .find(x => x.selCorrectionReason != "Select Correction");
    if (isReasonSelected)
      this.isSaveButtonDisable = false;
    //Uncomment this once fixed and comment below
    //this.isSaveButtonDisable = true;

  };
  public getBatchAgencyList() {
    this.paymentCorrectionService.getBatchAgencyList().subscribe(response => {
      // if (response.status == 200)  { 
      this.batchAgencyList = response;
      this.taxdetail['batchAgencyName'] = response['0'];
      console.log(this.taxdetail['batchAgencyName']);
      // }
    }, (err: HttpErrorResponse) => { })
  }

  public saveChangedPaymentCorrection() {
    $('#save-correction-reason').modal('hide');
  }
  public revertChangedPaymentCorrection() {
    this.paymentCorrectionResponse.paymentCorrectionDetails[this.paymentCorrectionSelectedObjectIndex] = this.paymentCorrectionSelectedObject;
    this.isOnChnagePaymentCorrection = this.isOnChnagePaymentCorrection;
    $('#save-correction-reason').modal('hide');
  }
  /**
   * @method getPaymentCorrectionSearchResult
   * @param formValues 
   * @description get payment correction search result based on form key
   */
  public getPaymentCorrectionSearchResult(formValues) {
    this.isPaymentCorrectionFlag = false;
    if (formValues && !this.isEmpty(formValues)) {
      this.paymentCorrectionService.getPaymentCorrectionSearchResult(formValues.rollYear, formValues.tracerNo, formValues.installNo).subscribe(responseData => {
        this.LoadPaymentCorrectionDetails(responseData);
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
  }

  /**
  * @method getPaymentCorrectionSearchResult
  * @param formValues 
  * @description get payment correction search result based on form key
  */
  public getPaymentCorrectionSearchResultInit(formValues) {
     console.log("formValues.installPaymentId="+formValues.installPaymentId)
    this.isPaymentCorrectionFlag = false;
    if (formValues && !this.isEmpty(formValues)) {
      this.paymentCorrectionService.getSearchResult(formValues.installPaymentId).subscribe(responseData => {
        if (responseData) {
          this.LoadPaymentCorrectionDetailsInit(responseData);
        }

      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
  }


  /**
   *  @method LoadPaymentCorrectionDetails
   * @param responseData
   * @description get Payment correction search Response and store in paymentCorrecionResponse
   */
  private LoadPaymentCorrectionDetailsInit(responseData) {
    //console.log("inside loadpaymentdetails"+responseData)
    this.paymentCorrectionResponse = responseData;
    this.paymentDetailModal.batchAgency = this.paymentCorrectionResponse.paymentCorrectionDetails[0].batchAgencyName;
    this.isPaymentCorrectionResponseResult = false;
  }


  /**
   *  @method LoadPaymentCorrectionDetails
   * @param responseData
   * @description get Payment correction search Response and store in paymentCorrecionResponse
   */
  private LoadPaymentCorrectionDetails(responseData) {
    //console.log("inside loadpaymentdetails"+responseData)
    if (responseData['item2'] == 'success') {
      this.paymentCorrectionResponse = responseData.item1;
      // Added Route
      if (this.paymentId && this.routerParams) {
        this.paymentCorrectionResponse['paymentCorrectionDetails'] = this.paymentCorrectionResponse.paymentCorrectionDetails.filter(item => {
          if (item.paymentId == this.paymentId) {
            return item;
          }
        })
      }

      this.paymentDetailModal.batchAgency = this.paymentCorrectionResponse.paymentCorrectionDetails[0].batchAgencyName;
      this.isPaymentCorrectionResponseResult = false;
    } else {
      this.paymentCorrectionResponse = responseData['item2'];

      this.isPaymentCorrectionResponseResult = true;
    }
    // this.isPaymentStatus(responseData);
  }

  // public selecedRowCorrection;
  public savePaymentDetail(ngModelObject, item) {
    this.editPayment = false;

    if (this.selectedCorrectionOption === 'Change Batch Agency') {
      this.saveBatchAgencyDetails();
    } else {
      this.savePaymentCorrectionDetails(ngModelObject);
    }
  }
  cancelBatchAgencyModal() {
    $('#batch-agency-modal').modal('hide');
  }
  public saveBatchAgencyDetails() {
    this.paymentCorrectionService.getBatchAgencyCount(this.paymentCorrectionResponse).subscribe(response => {
      this.batchAgencyUpdateMeg = response;
      $('#batch-agency-modal').modal({
        backdrop: 'static',
        keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
    }, (err: HttpErrorResponse) => { })
  }
  public savePaymentCorrectionDetails(ngModelObject) {
    this.batchAgencyNameTemp = this.paymentCorrectionResponse.paymentCorrectionDetails[0].batchAgencyName;
    this.paymentCorrectionResponse.paymentCorrectionDetails[0].batchAgencyName
      = this.paymentCorrectionResponse.paymentCorrectionDetails[0].newBatchAgencyName;
    this.paymentCorrectionResponse.paymentCorrectionDetails[0].newBatchAgencyName = this.batchAgencyNameTemp;

    console.log(this.paymentCorrectionResponse);

    this.paymentId = this.paymentCorrectionResponse.paymentCorrectionDetails[0].paymentId;

    this.paymentCorrectionService.savePaymentDetailchange(this.paymentCorrectionResponse).subscribe(response => {
      if ((this.selectedCorrectionOption === 'Change Batch Agency')) {
        this.cancelBatchAgencyModal();
      }
      if (response) {
        this.isOnChnagePaymentCorrection = '';
        this.getPaymentCorrectionSearchResult(this.search);
        this.isBatchAgencyReadOnly = true;
        this.isSaveButtonDisable = true;
        this.isPaymentCorrectionFlag = true;
        this.isSaveFailed = false;
        // this.paymentCorrectionResponse.paymentCorrectionDetails['0'].selCorrectionReason = '';
        this.isPaymentCorrectionPageSaved = response;
      } else {
        this.isPaymentCorrectionFlag = false;
      }
    }, (err: HttpErrorResponse) => {
      this.isPaymentCorrectionFlag = true;
      this.isSaveFailed = true;
      this.isPaymentCorrectionPageSaved = this.infoAlertMessages['server_error'];
      console.log(err);
    })

  }

  private isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}
