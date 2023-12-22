import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionRegisterService } from '../transaction-register/transaction-register.service';
import { AppCommons } from '../../shared/app.commons';
import { environment } from 'environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';

@Component({
  selector: 'app-year-end-supplemental-report',
  templateUrl: './year-end-supplemental-report.component.html',
  styleUrls: ['./year-end-supplemental-report.component.scss'],
  providers: [TransactionRegisterService, AppCommons],
  encapsulation: ViewEncapsulation.None
})
export class YearEndSupplementalReportComponent implements OnInit {

  reportHistoryResponse = [];
  dailyBatchReportFilter = {};
  startCalenderDate: any;
  calendarMinDate: any;
  public reportUrl: string;   // report URL
  language: string = "en-us"; // language support for report
  width: number = 100;   // width of report 
  height: number = 100;
  reportHistoryURL: any;
  reportServer: string;
  searchModel: any = {};
  isReportFromDateValid = false;
  isReportToDateValid = false;
  constructor(private transactionRegisterService: TransactionRegisterService, public appCommons: AppCommons, private domSanitizer: DomSanitizer, private _globalService: GlobalTaxToolService) { }

  ngOnInit() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    this.searchModel['from_date'] = this.FormatDateString(previousDay);

    this.initializeDefaultValues();
    this.getReportHistory();
  }

  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);

    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }

  initializeDefaultValues() {
    this.startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate() - 1, year: new Date().getFullYear() };
    this.calendarMinDate = { month: 7, day: 2, year: 2018 };
    this.startCalenderDate = this.appCommons.getCurrentData();
    this.dailyBatchReportFilter['transactionDate'] = this.appCommons.setPreviousDefaultDate()
  }

  /** Get report history response */
  getReportHistory() {

    let postParams = {
      "fromDate": "06/01/2019",
      "toDate": "07/09/2050",
      "reportName": "Year_End_Supp_Pending_Paid_Report",
      "reportType": "NTT",
      "environment": environment.currentEnvironment
    }
    this.getReportHistoryResponse(postParams);
  }

  /** click on table history table row */
  getSelectedReportDetail(url) {
    this.reportServer = '';
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public onDateSelected(date, key) {
    switch (key) {
      case 'from_date':
        this.searchModel['from_date'] = date;
        if (this.searchModel['to_date']) {
          this.isReportFromDateValid = false;
          if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
            this.isReportFromDateValid = true;
          }
          if (this.searchModel['from_date']) {
            this.isReportFromDateValid = false;
            this.isReportToDateValid = false;
            if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
              this.isReportFromDateValid = true;
              this.isReportToDateValid = false;
            }
          }
        }
        break;
      case 'to_date':
        this.searchModel['to_date'] = date;
        if (this.searchModel['from_date']) {
          this.isReportFromDateValid = false;
          this.isReportToDateValid = false;
          if (new Date(this.searchModel['from_date']) > new Date(this.searchModel['to_date'])) {
            this.isReportToDateValid = true;
          }
        }
        if (this.searchModel['toDate']) {
          this.isReportToDateValid = false;
          if (new Date(this.searchModel['fromDate']) > new Date(this.searchModel['toDate'])) {
            this.isReportToDateValid = true;
          }
        }
        break;
    }
  }
  onSubmit() {
    const postParams = {
      "fromDate": this.searchModel['from_date'],
      "toDate": this.searchModel['to_date'] ? this.searchModel['to_date'] : this.searchModel['from_date'],
      "reportName": "Year_End_Supp_Pending_Paid_Report",
      "reportType": "NTT",
      "environment": environment.currentEnvironment
    };
    this.getReportHistoryResponse(postParams);
  }
  private getReportHistoryResponse(postParams) {
    this.appCommons.showLoadingIocn();

    this.transactionRegisterService.getReportHistory(postParams).subscribe(reportHistory => {
      if (reportHistory.item2 === 'SUCCESS') {
        this.reportHistoryResponse = reportHistory.item1;
        this.appCommons.hideLoadingIcon();
      } else {
        this.reportHistoryResponse = [];
      }
    }, (err: HttpErrorResponse) => {
      this.appCommons.hideLoadingIcon();
    })
  }
}
