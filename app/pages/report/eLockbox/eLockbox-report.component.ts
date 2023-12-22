import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { TransactionRegisterService } from '../transaction-register/transaction-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppCommons } from '../../shared/app.commons';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';
import { NgbDatepickerPopup } from '../../common-component/ngb-date-picker/datepicker-popup';

@Component({
  selector: 'app-eLockbox-report',
  templateUrl: './eLockbox-report.component.html',
  styleUrls: ['./eLockbox-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ELockboxComponent implements OnInit {
  @ViewChild('dbPicker') dbPicker:NgbDatepickerPopup;
  startCalenderDate;
  public language: string = "en-us";
  public width: number = 100;
  public height: number = 100;
  public toolbar: string = "true";
  public reportServer: string;

  public reportHistoryURL: SafeUrl;
  public title: string;
  public reportType: string;
  public errorMsg: string;
  searchModel: any = {};
  isFromDateValid = false;
  isToDateValid = false;
  reportHistoryResponse = [];
  public reportName: string;

  constructor(public route: ActivatedRoute, public transactionRegisterService: TransactionRegisterService, private appCommons: AppCommons, private domSanitizer: DomSanitizer, private _globalService: GlobalTaxToolService) {
    this._getReportType();
  }

  private _getReportType() {
    this.route.paramMap.subscribe(paramMap => {
      if(this.dbPicker){
        this.dbPicker.clearNGModel();
      }
      this.reportServer = null;
      this.searchModel['from_date']=null;
      this.searchModel['to_date']=null;
      this.initDefaultFromDate();
      this.reportHistoryURL = null;
      this.reportType = paramMap.get('type');
      this._bindReportTitle(this.reportType);
    });
  }

  private _bindReportTitle(type) {
    switch (type) {
      case 'exceptionreport':
        this.title = 'eLockbox Exception Report';
        this.reportName = 'eLockbox_Exception_Report';
        break;
      case 'unionbankreport':
        this.title = 'eLockbox Union Bank Detail Report';
        this.reportName = 'eLockbox_Union_Bank_Detail_Report';
        break;
      case 'collectionsummary':
        this.title = 'eLockbox Collection Summary Report';
        this.reportName = 'eLockbox_Collection_Summary_Report';
        break;
      case 'batchsummary':
        this.title = 'Batch Summary Report';
        this.reportName = 'NTT_Elockbox_Union_Subreport';
        break;
      case 'collectiondetail':
        this.title = 'eLockbox Collection Detail Report';
        this.reportName = 'eLockbox_Collection_Detail_Report';
        break;
      default:
        this.title = 'Exception Report';
        this.reportName = 'NTT_Elockbox_Union_Subreport';
    }
    this.isToDateValid=null;
    this.isFromDateValid=null;
    this.getReportHistory();
  }
  ngOnInit() {
    this.initDefaultFromDate();
  }

  private initDefaultFromDate(){
    this.startCalenderDate = this.appCommons.getCurrentData();
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    //this.searchModel['from_date'] = this._globalService.FormatDateString(previousDay);

  }

  /** Get report history response */
  getReportHistory() {
    let postParams = {
      "fromDate": "06/01/2019",
      "toDate": "07/09/2050",
      "reportName": this.reportName,
      "reportType": "NTT",
      // "environment": "Dev"
      // "environment": "QA"
      // "environment": "UAT"
      // "environment": "PROD"
      "environment": environment.currentEnvironment

    }
    this.appCommons.showLoadingIocn();
    this.transactionRegisterService.getReportHistory(postParams).subscribe(reportHistory => {
      if (reportHistory.item2 === 'SUCCESS') {
        this.reportHistoryResponse = reportHistory.item1;
        this.appCommons.hideLoadingIcon();
      }
    }, (err: HttpErrorResponse) => {
      this.appCommons.hideLoadingIcon();
    })
  }
  public onDateSelected(date, key) {
    switch (key) {
      case 'from_date':
        this.searchModel['from_date'] = date;
        if (this.searchModel['to_date']) {
          this.isFromDateValid = false;
          if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
            this.isFromDateValid = true;
          }
          if (this.searchModel['from_date']) {
            this.isFromDateValid = false;
            this.isToDateValid = false;
            if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
              this.isFromDateValid = true;
              this.isToDateValid = false;
            }
          }
        }
        break;
      case 'to_date':
        this.searchModel['to_date'] = date;
        if (this.searchModel['from_date']) {
          this.isFromDateValid = false;
          this.isToDateValid = false;
          if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
            this.isToDateValid = true;
          }
        }
        if (this.searchModel['to_date']) {
          this.isToDateValid = false;
          if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
            this.isToDateValid = true;
          }
        }
        break;
    }
  }
  clearNgModelValue() { }
  onSubmit() {
    console.log(this.searchModel);
    const postParams = {
      "fromDate": this.searchModel['from_date'],
      "toDate": this.searchModel['to_date'] ? this.searchModel['to_date'] : this.searchModel['from_date'],
      "reportName": this.reportName,
      "reportType": "NTT",
      "environment": environment.currentEnvironment
    };
    this.getHistoryReportHistory(postParams)

  }

  private getHistoryReportHistory(postParams) {
    this.transactionRegisterService.getReportHistory(postParams).subscribe(reportHistory => {
      if (reportHistory.item2 === 'SUCCESS') {
        this.reportHistoryResponse = reportHistory.item1;
        this.appCommons.hideLoadingIcon();
      } else {
        this.reportHistoryResponse = [];
        this.errorMsg = reportHistory.item2;
      }
    }, (err: HttpErrorResponse) => {
      this.appCommons.hideLoadingIcon();
    })
  }
  public getSelectedReportDetail(url) {
    this.reportServer = '';
    this.appCommons.showLoadingIocn();
    setTimeout(() => {
      this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      this.appCommons.hideLoadingIcon();
    }, 500)

  }
}
