import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalTaxToolService } from '../../../_service/global-taxtools-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { CurrentSecuredService } from './current-secured.service';

@Component({
  selector: 'app-current-secured-collections',
  templateUrl: './current-secured-collections.component.html',
  styleUrls: ['./current-secured-collections.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CurrentSecuredService]
})
export class CurrentSecuredCollectionsComponent implements OnInit {

  rollYearList = [];
  
  formModel = { rollYear: this.rollYearList[0] };
  reportHistoryResponse = [];
  reportHistoryURL;
  errorMsg: string;
  private reportGUID;
  private reportDefinitionId;
  private monYear:string;
  isTaxCertify = false;
  isTaxApproved = false;
  isCertify: boolean;
  certifyLabel: string;
  approval_Message:string;
  is_Approved:boolean;
  public is_OPER_Allowed = true;
  month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  constructor(private currentSecuredService: CurrentSecuredService, private domSanitizer: DomSanitizer, private globalTaxToolService: GlobalTaxToolService) {
    // this.formModel['rollYear']="01/01/2020";
  }

  ngOnInit() {
    const InsertCertifyData = {
      "fromDate": "06/01/2019",
      "toDate": "07/08/2050",
      "reportName": "Current_Secured_Collections",
      "environment": "Dev",
     // "environment": environment.currentEnvironment
      "reportType": "NTT",
      currentEnvironment: "Dev"
    };
    this.getApptnYearList();
    this.getSecuredCollectionReport(InsertCertifyData);
  }

  private getApptnYearList(): void {
    this.currentSecuredService.getApptnYearList().subscribe(yearList => {
      this.rollYearList = yearList;
      this.formModel.rollYear= this.rollYearList[0];
    }, err => {
      this.rollYearList = [];
    });
  }
  onSubmit() {
    const InsertCertifyData = {
      ...this.formModel.rollYear['dateRange'],
      "reportName": "Current_Secured_Collections",
      "environment": "Dev",
      "reportType": "NTT",
      reportViewer: 'https://ssrspbid.acgov.org/ReportServer/Pages/ReportViewer.aspx',
      reportUrl: 'Development/TaxTools/Apportionment',
      currentEnvironment: "Dev"
    };
    this.getSecuredCollectionReport(InsertCertifyData);
  }

  private getSecuredCollectionReport(InsertCertifyData) {
    this.currentSecuredService.getReportHistory(InsertCertifyData).subscribe(reportHistory => {
      if (reportHistory.item2 === 'SUCCESS') {
        this.reportHistoryResponse = this.postResponseHandler(reportHistory.item1);
      } else {
        this.reportHistoryResponse = [];
        this.errorMsg = reportHistory.item2;
      }
    }, err => {
      this.reportHistoryResponse = [];
    })
  }
  private postResponseHandler(responseList) {
    let updatedRecored = [];
    if (responseList && responseList.length) {

      responseList.map(report => {
        let newReportName = report.reportName.split(' ');
        newReportName.pop(); // Remove last word from list
        let reportName = newReportName.join(' '); // convert array to string 
        let year = report.parameters_Used.find(reportItem => reportItem.name === "RollYear").values[0];
        let endYear = report.parameters_Used.find(reportItem => reportItem.name === "EndYear").values[0];
        let reportYear= year;
        let currentMonth = report.parameters_Used.find(reportItem => reportItem.name === "CurrentMonth").values[0];
        /** Filter data using year */
        let selectedYear = this.formModel.rollYear.label.split('/')[0];

        // if (parseInt(currentMonth) >= 10) {
        //   year = year;
        // } else {
        //   year = parseInt(year) + 1;
        // }
        //report['newReportName'] = reportName + ' ' + this.month_names_short[parseInt(currentMonth) - 1] + ' ' + year;
         report['newReportName'] = reportName + ' ' + this.month_names_short[parseInt(currentMonth) - 1] + ' ' + endYear;
        report['monYear'] = this.month_names_short[parseInt(currentMonth) - 1] + '' + endYear;
        if (parseInt(selectedYear) === parseInt(reportYear)) {
          updatedRecored.push(report);
        }
      });
    }
    if (! updatedRecored.length){
       this.reportHistoryResponse = [];
       this.errorMsg='NO REPORT SNAPSHOT IS AVAILABLE THAT MATCHES YOUR SEARCH CRITERIA. PLEASE CHANGE YOUR SEARCH AND TRY AGAIN';
    }
  
    return updatedRecored;
  }
  getSelectedReportDetail(report) {
    this.reportHistoryURL = this.domSanitizer.bypassSecurityTrustResourceUrl(report.reportURL);
    this.reportGUID = report.parameters_Used.find(reportItem => reportItem.name === "ReportGUID").values[0];
    this.reportDefinitionId = report.parameters_Used.find(reportItem => reportItem.name === "REPORT_DEFINITION_ID").values[0];
    this.monYear = report['monYear'];
    console.log(this.reportGUID);
    this.getCertifyData();
  }
  private getCertifyData(): void {
    if (this.reportGUID) {
      this.currentSecuredService.getCertifyData(this.reportGUID).subscribe(response => {
        this.certifyLabel = response.message;
        this.approval_Message = response.approval_Message;
        this.isCertify = response.is_Certified;
        this.is_Approved = response.is_Approved;
        this.isTaxCertify = this.isCertify;
        this.isTaxApproved = this.is_Approved;
        this.validateUserHasPermissionForSave();
      }, err => {
        console.log(err);
      });
    }
  }
  /**
   * saveCertifyData
   */
  public saveCertifyData() {
    let InsertCertifyData = {
      guid: this.reportGUID,
      certify_User: this.globalTaxToolService.getData().userId,
      monYear: this.monYear,
      reportDefinitionId:this.reportDefinitionId,
      approved_User: this.globalTaxToolService.getData().userId,
      approval_Status: this.isTaxApproved ?"Y" : "N",
      certify_Status: this.isTaxCertify ? "Y" : "N"
    };
    this.currentSecuredService.saveCertifyData(InsertCertifyData).subscribe(response => {
      this.certifyLabel = response.message;
      this.isCertify = response.is_Certified;
      this.approval_Message = response.approval_Message;
      this.is_Approved = response.is_Approved;
    }, err => { });
  }

  canCertified = false;
  canApproved = false;
  private validateUserHasPermissionForSave() {
    let certifyallowedPaylod= {
      userName : this.globalTaxToolService.getData().userId
    };

    //  MOCK data to test 
  //   var response = {
  //     "can_Certified": false,
  //     "can_Approved": false
  // }
  // this.canCertified = response.can_Certified,
  // this.canApproved = response.can_Approved;
  
    this.currentSecuredService.getPrivilege(certifyallowedPaylod).subscribe(response => {
      this.canCertified = response.can_Certified,
      this.canApproved = response.can_Approved;
    }, err => {
    });
  }
}
