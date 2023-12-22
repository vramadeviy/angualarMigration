import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppCommons } from '../../shared/app.commons';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionRegisterService } from '../transaction-register/transaction-register.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';
@Component({
  selector: 'app-daily-batch-report',
  templateUrl: './daily-batch-report.component.html',
  styleUrls: ['./daily-batch-report.component.scss'],
  providers: [AppCommons, TransactionRegisterService],
  encapsulation: ViewEncapsulation.None
})
export class DailyBatchReportComponent implements OnInit {
  //public reportServer:string; // report srver URL
  reportServer;
  public reportUrl: string;   // report URL
  language: string = "en-us"; // language support for report
  width: number = 100;   // width of report 
  height: number = 100;   // height f report
  showParameters = "true";
  parameters;
  testEnv = environment.currentEnvironment;

  dailyBatchReportFilter = [{
    'transactionDate': ''
  }];
  reportHistoryResponse;
  reportHistoryURL: SafeUrl;
  calendarMinDate;
  startCalenderDate; // set Max date as current date
  searchModel: any = {};
  isReportFromDateValid = false;
  isReportToDateValid = false;
  constructor(public appCommons: AppCommons, private transactionRegisterService: TransactionRegisterService, private domSanitizer: DomSanitizer, private _globalService: GlobalTaxToolService) { }

  ngOnInit() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    //this.searchModel['from_date'] = this.FormatDateString(previousDay);
    this.initializeDefaultValues();
    this.getReportHistory();
    console.log(environment.currentEnvironment);
    this.testEnv = environment.currentEnvironment;
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
  public onSelectNotify(date, key) {
    switch (key) {
      case 'Transaction Date':
        this.dailyBatchReportFilter['transactionDate'] = date;
        break;
    }
  }

  /** Get report history response */
  getReportHistory() {
    let postParams = {
      "fromDate": "06/01/2019",
      "toDate": "07/09/2050",
      "reportName": "Daily_Batch_Report",
      "reportType": "NTT",
      // "environment": "Dev" 
      //"environment": "QA"
      //"environment": "UAT"
      //"environment": "Prod"
      "environment": environment.currentEnvironment


    }
    this.getReportHistoryResponse(postParams);
  }

  /** click on table history table row */
  getSelectedReportDetail(url) {
    this.reportServer = '';
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
  getReport(dailyBatchReportFilter) {
    setTimeout(() => {
      this.getReportDetails(dailyBatchReportFilter);
    })
  }
  //Report Defination ID(6) 
  //Transaction_Date 
  /**
   * get daily batch report using transaction date & ref_id
   * @param dailyBatchReportFilter 
   */
  getReportDetails(dailyBatchReportFilter1) {
    this.reportHistoryURL = '';
    this.reportServer = null;
    setTimeout(() => {
      this.reportServer = environment.reportViewer; //'http://us01dws033/ReportServer/Pages/ReportViewer.aspx'
      //this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx'
      // this.reportUrl = 'Development/TaxTools/Daily_Batch_Report';
      // this.reportUrl = 'System Test/TaxTools/Daily_Batch_Report';
      // this.reportUrl = 'User Acceptance/TaxTools/Daily_Batch_Report';
      //this.reportUrl = 'Prod/TaxTools/Daily_Batch_Report';
      this.reportUrl = environment.reportUrl + "Daily_Batch_Report";
      this.showParameters = "true";
      this.parameters = {
        "Transaction_Date": dailyBatchReportFilter1['transactionDate'],
        "REPORT_DEFINITION_ID": 6
      };
    });
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
      "reportName": "Daily_Batch_Report",
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

