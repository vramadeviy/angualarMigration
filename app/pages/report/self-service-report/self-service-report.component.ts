import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDatepickerPopup } from '../../common-component/ngb-date-picker/datepicker-popup';
import { NgbDateFRParserFormatter } from '../../payment-lookup/ngb-date-fr-parser-formatter';
import { SelfServiceReportService } from './self-service-report.service';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';

import { HttpErrorResponse } from '@angular/common/http';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AppCommons } from '../../shared/app.commons';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';

@Component({
  selector: 'app-self-service-report',
  templateUrl: './self-service-report.component.html',
  styleUrls: ['./self-service-report.component.scss'],
  providers: [AppCommons, SelfServiceReportService],
  encapsulation: ViewEncapsulation.None
})
export class SelfServiceReportComponent implements OnInit {
  public reportServer: string; // report srver URL
  public reportUrl: string;   // report URL
  language: string = "en-us"; // language support for report
  width: number = 100;   // width of report 
  height: number = 100;   // height of report
  showParameters = "true";
  parameters;
  reportHistoryURL: SafeUrl;
  startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate() - 1, year: new Date().getFullYear() };
  public ngbDatepickerPopup: NgbDatepickerPopup;
  public selecteReportType;
  dropdownSettings;
  reportHistoryResponse: any; //hold  report history response
  isFormDateValid=false;
  isDateValidate=false;
  public selfServiceReportFilter = {
    'depositFromDate': '',
    'depositToDate': ''
  };
  searchModel: any = {};
  isReportFromDateValid = false;
  isReportToDateValid = false;

  constructor(public appCommons: AppCommons,
    private selfServiceReportService: SelfServiceReportService, public domSanitizer: DomSanitizer, private _globalService: GlobalTaxToolService
  ) {
    //  this.dropdownSettings = this.appCommons.getMultiselectionDropDownSettings(false, //'item_id', 'item_id', 'item_text', 'Select All', 'Unselect All')
  }

  ngOnInit() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    //this.searchModel['from_date'] = this.FormatDateString(previousDay);
    this.initializeDefaultValues();
    this.getReportHistory();

  }
  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);

    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }
  initializeDefaultValues() {
    this.startCalenderDate = this.appCommons.getCurrentData();
    
  }

  getReport(selfServiceReportFilter) {
    this.getReportDetails(selfServiceReportFilter);
  }

  getSelectedReportDetail(url) {
    this.reportServer = '';
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /** Get report history response */
  getReportHistory() {
    let postParams = {
      "fromDate": "06/01/2019",
      "toDate": "07/08/2050",
      "reportName": "BatchType_SelfService_Report",
      "reportType": "NTT",
     //  "environment": "Dev"
    // "environment": "QA"
      // "environment": "UAT"

      // "environment": "PROD"
      "environment": environment.currentEnvironment
    }
    this.getReportHistoryResponse(postParams);    
   
  }
  /**
   * 
   * @param selfServiceReport 
   */
  getReportDetails(selfServiceReportUi) {
    this.reportHistoryURL = '';
    this.reportServer = null;
    setTimeout(() => {
     // this.reportServer = 'http://us01dws033/ReportServer/Pages/ReportViewer.aspx'
     // this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx'
    //  this.reportUrl = 'Development/TaxTools/BatchType_SelfService_Report'; 
     // this.reportUrl = 'System Test/TaxTools/BatchType_SelfService_Report';
     // this.reportUrl = 'User Acceptance/TaxTools/BatchType_SelfService_Report';
    // this.reportUrl = 'Prod/TaxTools/BatchType_SelfService_Report';
     
     this.reportServer = environment.reportViewer;
     this.reportUrl = environment.reportUrl+"BatchType_SelfService_Report";
     
      this.showParameters = "true";
      this.parameters = {
        "Deposit_Date_From": selfServiceReportUi['depositFromDate'],
        "Deposit_Date_To": selfServiceReportUi['depositToDate'],
        "REPORT_DEFINITION_ID": 7
      };
    });
  }

  public onSelectNotify(date, key) {
    switch (key) {
      case 'depositFromDate':
        this.selfServiceReportFilter['depositFromDate'] = date;
        if (this.selfServiceReportFilter['depositToDate']) {
          this.isDateValidate = false;
          if (new Date(this.selfServiceReportFilter['depositFromDate']) > new Date(this.selfServiceReportFilter['depositToDate'])) {
            this.isDateValidate = true;
          }
          if (this.selfServiceReportFilter['depositFromDate']) {
            this.isDateValidate = false;
            this.isFormDateValid = false;
            if (new Date(this.selfServiceReportFilter['depositFromDate']) > new Date(this.selfServiceReportFilter['depositToDate'])) {
              this.isDateValidate = true;
              this.isFormDateValid = false;
            }
          }
        }
        break;
      case 'depositToDate':
        this.selfServiceReportFilter['depositToDate'] = date;
        if (this.selfServiceReportFilter['depositFromDate']) {
          this.isFormDateValid = false;
          this.isDateValidate = false;
          if (new Date(this.selfServiceReportFilter['depositFromDate']) > new Date(this.selfServiceReportFilter['depositToDate'])) {
            this.isFormDateValid = true;
          }
        }
        if (this.selfServiceReportFilter['depositToDate']) {
          this.isFormDateValid = false;
          if (new Date(this.selfServiceReportFilter['depositFromDate']) > new Date(this.selfServiceReportFilter['depositToDate'])) {
            this.isFormDateValid = true;
          }
        }
        break;
    }
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
      "reportName": "BatchType_SelfService_Report",
      "reportType": "NTT",
      "environment": environment.currentEnvironment
    };
    this.getReportHistoryResponse(postParams);
  }
  private getReportHistoryResponse(postParams) {
    this.appCommons.showLoadingIocn();

    this.selfServiceReportService.getReportHistory(postParams).subscribe(reportHistory => {
      if (reportHistory.item2 === 'SUCCESS') {
        this.reportHistoryResponse = reportHistory.item1;
        this.appCommons.hideLoadingIcon();
      }else{
        this.reportHistoryResponse=[];
      }
    }, (err: HttpErrorResponse) => {
      this.appCommons.hideLoadingIcon();
    })
  }
}
