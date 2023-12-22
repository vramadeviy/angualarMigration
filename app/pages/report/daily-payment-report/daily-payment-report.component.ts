import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDatepickerPopup } from '../../common-component/ngb-date-picker/datepicker-popup';
import { NgbDateFRParserFormatter } from '../../payment-lookup/ngb-date-fr-parser-formatter';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AppCommons } from '../../shared/app.commons';
import { TransactionRegisterService } from '../transaction-register/transaction-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';

const DAILYSEARCHOPTIONLIST = [
  {
    description: 'Daily Report',
    id: 1, reportType: '1'
  },
  {
    description: 'Transaction Date Range',
    id: 2, reportType: '2'
  }
];
const INCLUDETYPELIST = [
  { item_id: 'MONTH_TO_DATE', item_text: 'Month to Date' },
  { item_id: 'CURRENTYEAR_TO_DATE', item_text: 'Current Year to Date' },
  { item_id: 'PRIOR_FISCAL_YEAR', item_text: 'Prior Year Grand Totals' }];
@Component({
  selector: 'app-daily-payment-report',
  templateUrl: './daily-payment-report.component.html',
  styleUrls: ['./daily-payment-report.component.scss'],
  providers: [AppCommons, TransactionRegisterService, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class DailyPaymentReportComponent implements OnInit {
  searchModel: any = {};
  language: string = "en-us";
  width: number = 100;
  height: number = 100;
  toolbar: string = "true";
  isFromDateValid = false;
  isToDateValid=false;
  isReportFromDateValid=false;
  transactionDateValidation = false;
  isReportToDateValid=false;
  errorMsg='';
  startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate() - 1, year: new Date().getFullYear() };

  public ngbDatepickerPopup: NgbDatepickerPopup;
  public selecteReportType;
  public dailySearchOptions = DAILYSEARCHOPTIONLIST;
  reportHistoryResponse: any;
  type = INCLUDETYPELIST;

  reportHistoryURL: SafeUrl;

  dropdownSettings;
  public dailyReportFrom = '';
  dailyReportTo = '';
  public dailyReportFilter = {
    transactionDate: '',
    dailyReportFrom: '',
    dailyReportTo: '',
    reportType: '',
    moreOption: []
  };
  /** 
  
  •	REPORT_DEFINITION_ID – Default 1 as integer 
  •	TRANSACTION_DATE_FROM – DateTime eg.  Format - 02/28/2019 
  •	TRANSACTION_DATE_TO- DateTime eg. Format -02/28/2019
  •	MONTH_TO_DATE – Needs to pass Y OR N   - Default - N
  •	CURRENTYEAR_TO_DATE – Needs to pass Y OR N  - Default - N
  •	PRIOR_FISCAL_YEAR - Needs to pass Y OR N  - Default - N
  
    */
  reportServer: string;
  reportUrl: string;
  showParameters: string = "false";
  parameters: any = {};
  constructor(private appCommons: AppCommons, private transactionRegisterService: TransactionRegisterService, private domSanitizer: DomSanitizer,private _globalService: GlobalTaxToolService) {
    this.dropdownSettings = this.appCommons.getMultiselectionDropDownSettings(false, 'item_id', 'item_id', 'item_text', 'Select All', 'Unselect All')
  }

  ngOnInit() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    //this.searchModel['from_date'] = this.FormatDateString(previousDay);
    if (this.dailySearchOptions) {
      this.onSelectedType(this.dailySearchOptions[1]);
    }
    this.getReportHistory();
  }

  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);

    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }
  /** Get report history response */
  getReportHistory() {
    let postParams = {
      "fromDate": "06/01/2019",
      "toDate": "07/09/2050",
      "reportName": "Daily_Payment_Report_Snapshot",
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

  /** click on table history table row */
  getSelectedReportDetail(url) {
    this.reportServer = '';
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public onSelectedType(entry) {
    this.dailyReportFilter['reportType'] = entry['reportType'];
    //  this.ngbDatepickerPopup.clearNGModer();    
    this.selecteReportType = entry['reportType'];
    this.selecteReportType == '1' ? this.dailyReportFilter['transactionDate'] = this.appCommons.setPreviousDefaultDate() : ''
  }


  public onSelectNotify(date, key) {
    switch (key) {
      case 'From':
        this.dailyReportFilter['dailyReportFrom'] = date;
        if (this.dailyReportFilter['dailyReportTo']) {
          this.isFromDateValid = false;
          if (new Date(this.dailyReportFilter['dailyReportFrom']) > new Date(this.dailyReportFilter['dailyReportTo'])) {
            this.isFromDateValid = true;
          }
          if (this.dailyReportFilter['dailyReportFrom']) {
            this.isFromDateValid = false;
            this.isToDateValid = false;
            if (new Date(this.dailyReportFilter['dailyReportFrom']) > new Date(this.dailyReportFilter['dailyReportTo'])) {
              this.isFromDateValid = true;
              this.isToDateValid = false;
            }
          }
        }
        break;
      case 'To':
        this.dailyReportFilter['dailyReportTo'] = date;
        if (this.dailyReportFilter['dailyReportFrom']) {
          this.isFromDateValid = false;
          this.isToDateValid = false;
          if (new Date(this.dailyReportFilter['dailyReportFrom']) > new Date(this.dailyReportFilter['dailyReportTo'])) {
            this.isToDateValid = true;
          }
        }
        if (this.dailyReportFilter['dailyReportTo']) {
          this.isToDateValid = false;
          if (new Date(this.dailyReportFilter['dailyReportFrom']) > new Date(this.dailyReportFilter['dailyReportTo'])) {
            this.isToDateValid = true;
          }
        }
        break;
      case 'Transaction Date':
        this.dailyReportFilter['transactionDate'] = date;
        break;
    }
  }

  getReport(object, formObject) {
    this.reportServer = ''
    this.parameters = {};
      setTimeout(() => {
        this.getReportDetail(object, formObject);
        this.appCommons.hideLoadingIcon();
      }, 1000);
  }
  getReportDetail(object, formObject) {
    this.reportHistoryURL = '';
    this.appCommons.showLoadingIocn();
    if (object.reportType == '2' && !this.validateDate(object['dailyReportFrom'], 'formDateValidation')) {
       this.reportServer =environment.reportViewer; //'http://ssrsdev/Reports_SSRSTEST/Pages/Report.aspx';
      //this.reportServer = 'http://us01dws033/ReportServer/Pages/ReportViewer.aspx';
      //this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx';
     //this.reportUrl = 'Development/TaxTools/Daily_Payment_Report';
     // this.reportUrl = 'System Test/taxtools/Daily_Payment_Report';
      // this.reportUrl = 'User Acceptance/taxtools/Daily_Payment_Report';
      this.reportUrl = environment.reportUrl+"Daily_Payment_Report";
       //this.reportUrl = 'Prod/TaxTools/Daily_Payment_Report';
      this.showParameters = "true";
      this.parameters = {
        "MONTH_TO_DATE": "N",
        "DEPOSIT_DATE_FROM": object['dailyReportFrom'],
        "DEPOSIT_DATE_TO": object['dailyReportTo'],
        "REPORT_DEFINITION_ID": 1,
        "CURRENTYEAR_TO_DATE": "N",
        "PRIOR_FISCAL_YEAR": "N"
      };

    } else if (object.reportType == '1' && !this.validateDate(object['transactionDate'], 'transactionDateValidation')) {
      let selectedInludeOption = this.appCommons.getObjectToArray(object['moreOption'], 'item_id');
      this.reportServer =environment.reportViewer;
     // this.reportServer = 'http://us01dws033/ReportServer/Pages/ReportViewer.aspx';
     // this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx';
    // this.reportUrl = 'Development/TaxTools/Daily_Payment_Report';
      //this.reportUrl = 'System Test/taxtools/Daily_Payment_Report';
      // this.reportUrl = 'User Acceptance/taxtools/Daily_Payment_Report';
      // this.reportUrl = 'Prod/TaxTools/Daily_Payment_Report';
      this.reportUrl = environment.reportUrl+"Daily_Payment_Report";
      this.showParameters = "true";
      this.parameters = {
        "MONTH_TO_DATE": selectedInludeOption.includes('MONTH_TO_DATE') ? 'Y' : 'N',
        "DEPOSIT_DATE_FROM": object['transactionDate'],
        "DEPOSIT_DATE_TO": object['transactionDate'],
        "REPORT_DEFINITION_ID": 1,
        "CURRENTYEAR_TO_DATE": selectedInludeOption.includes('CURRENTYEAR_TO_DATE') ? 'Y' : 'N',
        "PRIOR_FISCAL_YEAR": selectedInludeOption.includes('PRIOR_FISCAL_YEAR') ? 'Y' : 'N'

      };
    }
  }
  onItemSelect(event) {
  }
  onSelectAll(event) { }

  validateDate(dateKey, key) {
    if (dateKey) {
      this[key] = this.appCommons.validateFeatureDate(dateKey);
      return this[key];
    }
  }

  onSubmit() {
    const postParams = {
      "fromDate": this.searchModel['from_date'],
      "toDate": this.searchModel['to_date'] ? this.searchModel['to_date'] : this.searchModel['from_date'],
      "reportName": "Daily_Payment_Report_Snapshot",
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
}


