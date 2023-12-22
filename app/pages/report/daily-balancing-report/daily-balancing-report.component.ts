import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as $ from 'jquery';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';
import { environment } from "environments/environment";
import { TransactionRegisterService } from "../transaction-register/transaction-register.service";
import { AppCommons } from "../../shared/app.commons";
import { HttpErrorResponse } from "@angular/common/http";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-daily-balancing-report",
  templateUrl: "./daily-balancing-report.component.html",
  styleUrls: ["./daily-balancing-report.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [TransactionRegisterService, AppCommons]
})
export class DailyBalancingReportComponent implements OnInit {

  searchModel: any = {};
  isReportFromDateValid = false;
  isReportToDateValid = false;
  public isToDateValid = false;
  public isFromDateValid = false;
  reportHistoryResponse = [];
  reportHistoryURL: SafeUrl;
  errorMsg = '';
  startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate(), year: new Date().getFullYear() };
  constructor(private _globalService: GlobalTaxToolService,private transactionRegisterService: TransactionRegisterService, private domSanitizer: DomSanitizer, private appCommons: AppCommons) { }

  ngOnInit() {
    this.initValues();
    this.getDefaultReport()
  }
  initValues() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    // this.searchModel['from_date'] = this.FormatDateString(previousDay);
  }
  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);
    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
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
              if (this.searchModel['toDate']) {
                this.isToDateValid = false;
                if (new Date(this.searchModel['fromDate']) > new Date(this.searchModel['toDate'])) {
                  this.isToDateValid = true;
                }
              }
            break;
    }
}

  private getDefaultReport() {
    const postParams = {
      "fromDate": "06/01/2019",
      "toDate": "07/08/2050",
       "reportName": "Daily_Balancing_Report",
      // "reportName": "Daily_Exception_Report", 
      "reportType": "NTT",
      "environment": environment.currentEnvironment
    };
    this.getReportHistory(postParams);
  }
  private getReportHistory(postParams) {
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
  onSubmit(){
    const postParams = {
      "fromDate": this.searchModel['from_date'],
      "toDate": this.searchModel['to_date'] ? this.searchModel['to_date'] : this.searchModel['from_date'],
      "reportName": "Daily_Balancing_Report",
      "reportType": "NTT",
      "environment": environment.currentEnvironment
    };
    this.getReportHistory(postParams)
  }

  /** click on table history table row */
  getSelectedReportDetail(url) {
    //this.reportServer = '';
    // let url="http://ssrsdev.acgov.org/Reports_SSRSTEST/Pages/Report.aspx?ItemPath=%2fDevelopment%2fTaxTools%2fNTT_Daily_Balancing_Report";
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
