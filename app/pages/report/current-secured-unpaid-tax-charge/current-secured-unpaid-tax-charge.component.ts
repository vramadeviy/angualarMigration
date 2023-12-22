import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { TransactionRegisterService } from '../transaction-register/transaction-register.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-current-secured-unpaid-tax-charge',
  templateUrl: './current-secured-unpaid-tax-charge.component.html',
  styleUrls: ['./current-secured-unpaid-tax-charge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[TransactionRegisterService]
})
export class CurrentSecuredUnpaidTaxChargeComponent implements OnInit {
  public reportHistoryResponse=[];
  public REPORT_NAME="Current_Sec_Unpaid_Tax_Charges";
  public errorMsg='';
  public reportHistoryURL:SafeUrl;
  constructor(private transactionRegisterService: TransactionRegisterService, private domSanitizer : DomSanitizer) { }

  ngOnInit() {
    const InsertCertifyData = {
      "fromDate": "06/01/2019",
      "toDate": "07/09/2050",
      "reportName": this.REPORT_NAME,
      "environment": environment.currentEnvironment,
      "reportType": "APTIS",
      reportViewer: 'https://ssrspbid.acgov.org/ReportServer/Pages/ReportViewer.aspx',
      reportUrl: 'Development/APTIS/Apportionment',
      currentEnvironment: "Dev"
    };
    this.fetchCurrentSecuredUnpaidReport(InsertCertifyData);
  }

  private fetchCurrentSecuredUnpaidReport(params) {
    this.transactionRegisterService.getReportHistory(params).subscribe(reportHistory => {
      if (reportHistory.item2 === 'SUCCESS') {
        this.reportHistoryResponse = reportHistory.item1;
      } else {
        this.reportHistoryResponse = [];
        this.errorMsg = reportHistory.item2;
      }
    }, err => {
      this.reportHistoryResponse = [];
    })
  }
  /**
   * getSelectedReportDetail
   */
  public getSelectedReportDetail(url) {
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
