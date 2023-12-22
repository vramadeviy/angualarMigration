import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FromTracer, ToTracer } from './reapply-payment.model'
import { CommonService } from '../_service/common.service';
import { ReapplyPaymentService } from './reapply-payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InfoAlertMessages } from '../shared/Info-alert-messages.data';
import { Subject } from 'rxjs';
import { DialogService } from '../_service/dialog.service';
declare var $: any;

@Component({
  selector: 'app-reapply-payment',
  templateUrl: './reapply-payment.component.html',
  styleUrls: ['./reapply-payment.component.scss'],
  providers: [ReapplyPaymentService, DialogService],
  encapsulation: ViewEncapsulation.None
})
export class ReapplyPaymentComponent {
  public infoAlertMessages = InfoAlertMessages;
  public waivePenaltiesStatus=false;
  public fromTracer = new FromTracer();
  public isSaveButtonDisable = true;
  public toTracer = new ToTracer();
  public fromTracerResponse: any = []; // hold from tracer payment response
  public fromTracerLength;
  public toTracerResponse: any = []; // hold to tracer payment response
  public toTracerLength;
  public toTracerError;
  public fromTracerError;
  public fromTotalAmount = 0;   // hold total amount for from section container
  public toTotalAmount = 0;  //  // hold total amount for from section container
  public formUniqeDetailNo = [];
  public taxRollYearList: any = [
    { item_id: 2018, item_text: '2018' },
    { item_id: 2017, item_text: '2017' }];
  public installmentType = [
    { item_id: 1, item_text: 'Install 1' },
    { item_id: 2, item_text: 'Install 2' },
  ];
  public isPaymentReapplySavedFlag: boolean = false;
  public unsubscribe: Subject<void> = new Subject<void>();

  public successMsg;
  constructor(public commonService: CommonService,
    public reapplyPaymentService: ReapplyPaymentService,
    public dialogService: DialogService) { }
  ngOnInit() {
    this.getPaymentLookupSelectedDetail();
  }

  public getPaymentLookupSelectedDetail() {
    this.commonService.getPaymentDetail().takeUntil(this.unsubscribe).subscribe(response => {
      if (response) {
        let postTracerParam = {
          'roll_year': response.paymentFiscalYear,
          'tracer_no': response.tracerNo,
          'install_no': response.installNo
        }
        this.getReaaplyPaymentDetailByID(response['installPaymentId']);
        // this.getToTracerPaymentDetail(postTracerParam);
      }
    });
  }
  getReaaplyPaymentDetailByID(installPaymentId) {
    this.reapplyPaymentService.getReaaplyPaymentDetailByID(installPaymentId).subscribe(response => {
      if (typeof response === 'object') {
        this.fromTracerResponse.push(response);
        this.formUniqeDetailNo.push(response['tracerNo'] + '_' + response['installNo']);
        this.fromTotalAmount = this.calculateTotal(this.fromTracerResponse, 'taxAmountPaid');
        this.fromTracerLength = this.fromTracerResponse.length;
        this.fromTracer['tracer_no'] = response['tracerNo'];
        this.fromTracer['install_no'] = response['installNo'];
      }
    }, (er: HttpErrorResponse) => {

    });
  }
  /**
   * @method getFromTracerPaymentDetail
   * @param ngModel 
   * @description get from tracer detail based on selected Keys
   */
  public getFromTracerPaymentDetail(ngModel) {
    this.isPaymentReapplySavedFlag = false;
    if (ngModel.roll_year || ngModel.tracer_no || ngModel.install_no) {
      this.reapplyPaymentService.getFromTracerReapplyPaymentDetail(ngModel.roll_year, ngModel.tracer_no, ngModel.install_no).subscribe(response => {
        if (response.item2 == 'success') {
          let isRepeartObject = this.isRepeatObject(this.formUniqeDetailNo, this.fromTracer);
          if (isRepeartObject) {
            this.fromTracerResponse.push(response.item1);
            this.formUniqeDetailNo.push(response.item1.tracerNo + '_' + response.item1.installNo);
            this.fromTotalAmount = this.calculateTotal(this.fromTracerResponse, 'taxAmountPaid');
            this.fromTracerLength = this.fromTracerResponse.length;
            this.fromTracerError = null;
            this.isSaveButtonDisable = false;
          } else {
            this.fromTracerError = this.infoAlertMessages.From_Tracer_Once;
          }

        } else {
          this.fromTracerError = response.item2;
        }
      }, (err: HttpErrorResponse) => {

      });
    }
  }

  isRepeatObject(repeatArray, response) {
    let isObjectRepeat;
    if (repeatArray.length == 0) {
      return true;
    }
    if (repeatArray.indexOf(response.tracer_no + '_' + response.install_no) != -1) {
      return isObjectRepeat = false;
    } else {
      return isObjectRepeat = true;
    }
  }
  /**
   * @method getToTracerPaymentDetail
   * @param ngModel 
   * @description get To tracer detail based on selected Keys
   */
  public toUniqeDetailNo = [];

  public getToTracerPaymentDetail(ngModel) {
    this.isPaymentReapplySavedFlag = false;
    if (ngModel.roll_year || ngModel.tracer_no || ngModel.install_no) {
      this.reapplyPaymentService.getToTracerReapplyPaymentDetail(ngModel.roll_year, ngModel.tracer_no, ngModel.install_no).subscribe(response => {
        if (response.item2 == 'success') {
          let isRepeartObject = this.isRepeatObject(this.toUniqeDetailNo, this.toTracer);
          if (isRepeartObject) {
            this.toTracerResponse.push(response.item1);
            this.toUniqeDetailNo.push(response.item1['tracerNo'] + '_' + response.item1['installNo']);
            this.toTotalAmount = this.calculateTotal(this.toTracerResponse, 'totalAmountDue');
            this.toTracerLength = this.toTracerResponse.length;
            this.toTracerError = null;
            this.isSaveButtonDisable = false;
          } else {
            this.toTracerError = this.infoAlertMessages.To_Tracer_Once;
          }
        } else {
          this.toTracerError = response.item2;
        }
      }, (err: HttpErrorResponse) => {

      });
    }
  }

  /**
   * @description to calculate total amount when add To & From reaaply payment detail
   * @param response
   */
  public calculateTotal(response, key) {
    let amountTotal = 0;
    response.map(item => {
      amountTotal += item[key]
    })
    return Number(amountTotal.toFixed(2));
  }
  /**
   * @method delete
   * @param key 
   * @param index 
   * @description Delete selected item in from & to tracer payment detail response
   */
  public delete(key, index) {
    this.isPaymentReapplySavedFlag = false;
    switch (key) {
      case 'fromTracer':
        this.fromTracerResponse.splice(index, 1);
        this.formUniqeDetailNo.splice(index, 1);
        this.fromTotalAmount = this.calculateTotal(this.fromTracerResponse, 'taxAmountPaid');
        break;
      case 'toTracer':
        this.toTracerResponse.splice(index, 1);
        this.toUniqeDetailNo.splice(index, 1);
        this.toTotalAmount = this.calculateTotal(this.toTracerResponse, 'totalAmountDue');
        break;
    }
  }
  /** 
   * once switch from different component destroy the common service data
  */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.savePaymentDetail(null);
  }
  /**
   * @description click on reapply save button to save updated response
   */
  public saveDetail() {
    let status=this.waivePenaltiesStatus?'Y':'N';
    let postParam = {
      'fromPayments': this.fromTracerResponse,
      'toPayments': this.toTracerResponse,
       'wavePenalty':status
    };
    this.reapplyPaymentService.saveReapplyPayment(postParam).subscribe(response => {
      this.isPaymentReapplySavedFlag = true;
      this.successMsg = response;
    }, (err: HttpErrorResponse) => {
      this.isPaymentReapplySavedFlag = true;
      //this.successMsg = err;
    })
  }

  hideMsg(key) {
    switch (key) {
      case 'form':
        this.fromTracerError ? this.fromTracerError = false : null;
        break;
      case 'to':
        this.fromTracerError ? this.fromTracerError = false : null;
        break;
    }
  }
  canDeactivate() {
  
    if ((this.fromTracerResponse.length || this.toTracerResponse.length) && !this.successMsg) {
      let confirmMeg='All changes will be discarded and the Reapply Payment window will close. Are you sure you want to proceed (OK), or return to the Reapply Payment window (Cancel)?'
      let isRouteChange = this.dialogService.confirm(confirmMeg);
      isRouteChange['value'] ? true : false;//this.saveDetail()
      return isRouteChange;
    }
    return true;
  }

}



