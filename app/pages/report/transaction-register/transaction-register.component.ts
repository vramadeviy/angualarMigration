import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppCommons } from '../../shared/app.commons';
import { TransactionRegisterService } from './transaction-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';
const REPORTBYLIST = [{
  // value:'paymentSource',name:'Payment Source'
  value: '3', name: 'Payment Source'
}, {
  // value:'taxType',name:'Tax Type'
  value: '2', name: 'Tax Type'

}
]
@Component({
  selector: 'app-transaction-register',
  templateUrl: './transaction-register.component.html',
  styleUrls: ['./transaction-register.component.scss'],
  providers: [AppCommons, TransactionRegisterService],
  encapsulation: ViewEncapsulation.None
})
export class TransactionRegisterComponent implements OnInit {
  language: string = "en-us";
  width: number = 100;
  height: number = 100;
  toolbar: string = "true";
  reportServer;
  reportUrl;
  showParameters = "true";
  parameters;
  reportHistoryResponse; // hold report history response
  reportHistoryURL: SafeUrl;
  transactionRegisterModel = [{
    'depositDate': '',
    'reportBy': '',
    'pendingCorrection': ''
  }];
  reportByList = REPORTBYLIST;
  calendarMinDate;
  startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate(), year: new Date().getFullYear() };
  searchModel: any = {};
  isReportFromDateValid = false;
  isReportToDateValid = false;

  constructor(public appCommons: AppCommons, private transactionRegisterService: TransactionRegisterService, public domSanitizer: DomSanitizer, private _globalService: GlobalTaxToolService) { }

  ngOnInit() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    //this.searchModel['from_date'] = this.FormatDateString(previousDay);
    this.bindDefaultNgModelaValues();
    this.getReportHistory();
  }
  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);

    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }
  /** Get Report history of last 10 days */
  getReportHistory() {
    let postParams = {
      "fromDate": "07/01/2019",
      "toDate": "07/09/2050",
      "reportName": "Transaction_Register_By_Payment_Source",
      //"reportName": "Transaction_Register_By_Tax_Type",
      "reportType": "NTT",
      // "environment": "Dev"
      //"environment": "QA"
      // "environment": "UAT"
      // "environment": "PROD"
      "environment": environment.currentEnvironment
    }
    this.getReportHistoryResponse(postParams);
  }
  getSelectedReportDetail(url) {
    this.reportServer = '';
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
  bindDefaultNgModelaValues() {
    this.startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate() - 1, year: new Date().getFullYear() };
    this.calendarMinDate = { month: 7, day: 2, year: 2018 };
    this.transactionRegisterModel['reportBy'] = '2';

  }
  public onSelectNotify(date, key) {
    switch (key) {
      case 'depositDate':
        this.transactionRegisterModel['depositDate'] = date;
        break;
    }
  }
  getTransactionRegisterReport(ngModelValues) {
    this.reportHistoryURL = '';
    console.log(ngModelValues);
    this.reportServer = null;
    setTimeout(() => {
      //this.reportServer = 'http://us01dws033/ReportServer/Pages/ReportViewer.aspx'
      //this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx'
      // this.reportUrl = 'Development/TaxTools/Transaction_Register_Report';
      // this.reportUrl = 'System Test/TaxTools/Transaction_Register_Report';
      //this.reportUrl = 'User Acceptance/TaxTools/Transaction_Register_Report';
      //this.reportUrl = 'Prod/TaxTools/Transaction_Register_Report';
      this.reportServer = environment.reportViewer;
      this.reportUrl = environment.reportUrl + "Transaction_Register_Report";


      this.showParameters = "true";
      this.parameters = {
        "DEPOSIT_DATE_FROM": ngModelValues['depositDate'],
        "REPORT_DEFINITION_ID": ngModelValues['reportBy'],
        "Include_Pending": ngModelValues['pendingCorrection'] ? 'Y' : 'N'
      };
    });
  }
  //xyz

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
      "reportName": "Transaction_Register_By_Payment_Source",
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
