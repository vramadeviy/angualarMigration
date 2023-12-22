import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppCommons } from '../../shared/app.commons';
import { paymentSourcesData } from "./Tax-Collections-Data/payment-sources-data";
import { TransactionRegisterService } from '../transaction-register/transaction-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { GlobalTaxToolService } from '../../_service/global-taxtools-service';


@Component({
  selector: 'app-Tax-Collections-As-Payments.component',
  templateUrl: './Tax-Collections-As-Payments.component.html',
  styleUrls: ['./Tax-Collections-As-Payments.component.scss'],
  providers: [AppCommons, TransactionRegisterService],
  encapsulation: ViewEncapsulation.None
})


export class PaymentTaxCollectionComponent implements OnInit {
  searchModel: any = {};
  // public reportServer:string; // report srver URL
  public reportUrl: string;   // report URL
  language: string = "en-us"; // language support for report
  width: number = 100;   // width of report 
  height: number = 100;   // height f report
  showParameters = "true";
  parameters;
  reportHistoryURL: SafeUrl;
  isReportFromDateValid = false;
  transactionDateValidation = false;
  isReportToDateValid = false;
  reportHistoryResponse: any; //hold  report history response
  isFromDateValid = false;
  isToDateValid = false;
  reportServer;
  startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate() - 1, year: new Date().getFullYear() };


  taxCollectionPaymentModel = {
    'depositFromDate': '',
    'depositToDate': '',
    'paymentSource': []
  }
  paymentSourceList: any = [];
  paymentSourceListSelect: any = 'ALL';
  dropdownSettings = {};
  constructor(
    public appCommons: AppCommons,
    private transactionRegisterService: TransactionRegisterService,
    private domSanitizer: DomSanitizer,
    private _globalService: GlobalTaxToolService) {
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
    this.paymentSourceList = paymentSourcesData;

    //console.log(" this.paymentSourceList=" + this.paymentSourceList);
  }
  ngOnInit() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
   // this.searchModel['from_date'] = this.FormatDateString(previousDay);
    // this.taxCollectionPaymentModel['paymentSource'] = 'All';
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
      "toDate": "07/08/2050",
      "reportName": "Tax_Collections_Payment_Report",
      "reportType": "NTT",
      // "environment": "Dev"
      //  "environment": "QA"
      // "environment": "UAT"
      // "environment": "PROD"
      "environment": environment.currentEnvironment
    }
    this.getReportHistoryResponse(postParams);
  }

  /** click on table history table row */
  getSelectedReportDetail(url) {
    this.reportServer = '';
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
  onItemSelect(event) {
  }
  onSelectAll(event) { }

  /**
   * get daily batch report using transaction date & ref_id
   * @param dailyBatchReportFilter 
   */
  //ssrsdev/Reports_SSRSTEST/Pages/Folder.aspx?ItemPath=%2fDevelopment%2fTaxTools&ViewMode=List
  // http://ssrsdev/Reports_SSRSTEST/Pages/Report.aspx?ItemPath=%2fDevelopment%2fTaxTools%2fTax+Collections+Payment+Report 
  getTransactionRegisterReport(taxCollectionPaymentModel, reportFilter) {
    this.reportHistoryURL = '';
    this.reportServer = null;
    setTimeout(() => {
      //this.reportServer = 'http://us01dws033/ReportServer/Pages/ReportViewer.aspx'
      // this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx'
      // this.reportUrl = 'Development/TaxTools/Tax_Collections_Payment_Report';
      // this.reportUrl = 'System Test/TaxTools/Tax_Collections_Payment_Report';
      //this.reportUrl = 'User Acceptance/TaxTools/Tax_Collections_Payment_Report';
      // this.reportUrl = 'Prod/TaxTools/Tax_Collections_Payment_Report';
      this.reportServer = environment.reportViewer;
      this.reportUrl = environment.reportUrl + "Tax_Collections_Payment_Report";
      this.showParameters = "true";
      this.parameters = {
        "REPORT_DEFINITION_ID": 4,
        "P_Payment_Source": this.generatePaymentSourceList(taxCollectionPaymentModel['paymentSource']),
        //"P_Payment_Source":'',
        "DEPOSIT_DATE_FROM": taxCollectionPaymentModel['depositFromDate'],
        "DEPOSIT_DATE_TO": taxCollectionPaymentModel['depositToDate'] ? taxCollectionPaymentModel['depositToDate'] : taxCollectionPaymentModel['depositFromDate']
        // 
      };
    })
  }
  private generatePaymentSourceList(source) {
    let sourceList = [];
    source.map(item=>{
      if(typeof item == 'string'){
        sourceList.push(item.toString());
        // sourceList.push(item);
        
      }else{
        sourceList.push(item.item_id.toString());
        // sourceList.push(item.item_id);
        
      }
    });
    // remove .toString to sent an array 
    return sourceList.toString();
  }
  public onSelectNotify(date, key) {
    switch (key) {
      case 'From':
        this.taxCollectionPaymentModel['depositFromDate'] = date;
        if (this.taxCollectionPaymentModel['depositToDate']) {
          this.isFromDateValid = false;
          if (new Date(this.taxCollectionPaymentModel['depositFromDate']) > new Date(this.taxCollectionPaymentModel['depositToDate'])) {
            this.isFromDateValid = true;
          }
          if (this.taxCollectionPaymentModel['depositFromDate']) {
            this.isFromDateValid = false;
            this.isToDateValid = false;
            if (new Date(this.taxCollectionPaymentModel['depositFromDate']) > new Date(this.taxCollectionPaymentModel['depositToDate'])) {
              this.isFromDateValid = true;
              this.isToDateValid = false;
            }
          }
        }
        break;
      case 'To':
        this.taxCollectionPaymentModel['depositToDate'] = date;
        if (this.taxCollectionPaymentModel['depositFromDate']) {
          this.isFromDateValid = false;
          this.isToDateValid = false;
          if (new Date(this.taxCollectionPaymentModel['depositFromDate']) > new Date(this.taxCollectionPaymentModel['depositToDate'])) {
            this.isToDateValid = true;
          }
        }
        if (this.taxCollectionPaymentModel['depositToDate']) {
          this.isToDateValid = false;
          if (new Date(this.taxCollectionPaymentModel['depositFromDate']) > new Date(this.taxCollectionPaymentModel['depositToDate'])) {
            this.isToDateValid = true;
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
      "reportName": "Tax_Collections_Payment_Report",
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
