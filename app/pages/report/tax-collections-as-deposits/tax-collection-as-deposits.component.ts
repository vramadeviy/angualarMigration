import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppCommons } from '../../shared/app.commons';
import { TaxTypeList, PaymentSourceList, PaymentMethodList, MethodType } from './tax-collection-as-deposit-constant';
import { TaxCollectionAsDepositService } from './tax-collection-as-deposits.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';

const AMOUNTOPTIONLIST = [
  {
    description: 'Deposit Amount',
    id: 1
  }, {
    description: 'Total Tax Amount',
    id: 2
  }
];
@Component({
  selector: 'app-tax-collection-as-deposits.component',
  templateUrl: './tax-collection-as-deposits.component.html',
  styleUrls: ['./tax-collection-as-deposits.component.scss'],
  providers: [AppCommons, TaxCollectionAsDepositService],
  encapsulation: ViewEncapsulation.None
})
export class TaxCollectionAsDepositsComponent implements OnInit {
  public amountOptions = AMOUNTOPTIONLIST;
  formDateValidation = false;
  reportServer;
  reportUrl;
  showParameters;
  parameters;
  language: string = "en-us";
  width: number = 100;
  height: number = 100;
  toolbar: string = "true";
  dropdownSettings = {};// hold dropdown setting configurations
  dateType = null;
  taxTypeList = [...TaxTypeList];
  paymentSourseList = [...PaymentSourceList];
  paymentMethodList = [...PaymentMethodList];
  methodTypeList = [...MethodType];
  creditDate;
  tDate = 1;
  paymentCommentResponse;
  datePickerNgModelKeys = {
    transaction_date: '',
    credit_date: ''
  }
  taxCollectionPaymentModel = {
    'Tax_Type': '',
    'Payment_Source': [],
    'Payment_Method': [],
    'Method_Type': [],

    'Deposit_Date': 'Y',
    'Credit_Date': 'N',
    'From_Amount': '',
    'Report_Date': '',
    'To_Amount': '',
    'Total_Tax_Amount': 'N',
    'Deposit_Amount': 'Y',
    'Payment_Date': false
  }
  paymentSourceList: any = [];
  constructor(public appCommons: AppCommons, private taxCollectionAsDepositService: TaxCollectionAsDepositService, ) {
    this.setInitailConfig()
  }
  setInitailConfig() {
    this.dropdownSettings = this.appCommons.getMultiselectionDropDownSettings(false, 'item_id', null, 'item_text', 'Select All', 'Unselect All')
  }
  ngOnInit() {
  }
  getTransactionRegisterReport(filterData, reportFilter) {
    let selectedFilter = JSON.parse(JSON.stringify(filterData));
    this.reportServer = null;
    selectedFilter['Payment_Source'] = this.appCommons.getObjectToString(selectedFilter['Payment_Source'], 'item_id');
    selectedFilter['Payment_Method'] = this.appCommons.getObjectToString(selectedFilter['Payment_Method'], 'item_id');
    selectedFilter['Method_Type'] = this.appCommons.getObjectToString(selectedFilter['Method_Type'], 'item_id');
    selectedFilter['Payment_Date'] ? selectedFilter['Payment_Date'] = 'Y' : selectedFilter['Payment_Date'] = 'N'
    selectedFilter['Batch_No'] ? selectedFilter['Batch_No']  : selectedFilter['Batch_No'] = 0;

    // let newFilter = {"Tax_Type":"All","Payment_Source":[{"item_id":"SelfService_WEB","item_text":"Web"}],"Payment_Method":[{"item_id":"CreditCard","item_text":"Credit Cards"}],"Method_Type":[],"Deposit_Date":"Y","Credit_Date":"N","From_Amount":"","Report_Date":"12/6/2019","To_Amount":"","Total_Tax_Amount":"N","Deposit_Amount":"Y","Payment_Date":false};
    
    delete selectedFilter.rollYear;
    delete selectedFilter.tracerNo;
    delete selectedFilter.installNo;
    delete selectedFilter.comment;
 
       // filter {"Tax_Type":"All","Payment_Source":[{"item_id":"SelfService_WEB","item_text":"Web"}],"Payment_Method":[{"item_id":"CreditCard","item_text":"Credit Cards"}],"Method_Type":[],"Deposit_Date":"Y","Credit_Date":"N","From_Amount":"","Report_Date":"12/6/2019","To_Amount":"","Total_Tax_Amount":"N","Deposit_Amount":"Y","Payment_Date":false}
      //  newFilter.Tax_Type  =  selectedFilter.Tax_Type ;
      //  newFilter.Payment_Source  =  selectedFilter.Payment_Source ;
      //  newFilter.Payment_Method  =  selectedFilter.Payment_Method ;
      //  newFilter.Method_Type  =  selectedFilter.Method_Type ;
      //  newFilter.Deposit_Date  =  selectedFilter.Deposit_Date ;
      //  newFilter.Credit_Date  =  selectedFilter.Credit_Date ;
      //  newFilter.From_Amount  =  selectedFilter.From_Amount ;

      //  newFilter.Report_Date  =  selectedFilter.Report_Date ;
      //  newFilter.To_Amount  =  selectedFilter.To_Amount ;
      //  newFilter.Total_Tax_Amount  =  selectedFilter.Total_Tax_Amount ;

      //  newFilter.Deposit_Amount  =  selectedFilter.Deposit_Amount ;
      //  newFilter.Payment_Date  =  selectedFilter.Payment_Date ;
       



    //let _filter = new taxCollectionPaymentModel();
    console.log(this.tDate);
    console.log("filter "+JSON.stringify(filterData))
    setTimeout(() => {
      this.reportServer = environment.reportViewer;
      this.reportUrl = environment.reportUrl+"Tax_Collections_Deposit_Report";
     // this.reportServer = 'http://us01dws033/ReportServer/Pages/ReportViewer.aspx';
      //this.reportServer = 'http://ssrsp:80/ReportServer/Pages/ReportViewer.aspx'
       //this.reportUrl = 'User Acceptance/TaxTools/Tax_Collections_Deposit_Report';
     // this.reportUrl = 'System Test/TaxTools/Tax_Collections_Deposit_Report';
     // this.reportUrl = 'Development/TaxTools/Tax_Collections_Deposit_Report';
     // this.reportUrl = 'Prod/TaxTools/Tax_Collections_Deposit_Report';
      this.showParameters = "true";
      this.parameters = {
        "REPORT_DEFINITION_ID": 5,
        ...selectedFilter

        //"paymentSource": "CORTAC",
        //...filterData
        // 
      };
    })
  }

  public paymentCommentPost(taxCollectionPaymentModel) {

    let postParams = {
      "rollYear": taxCollectionPaymentModel['rollYear'],
      "tracerNo": taxCollectionPaymentModel['tracerNo'],
      "installNo": taxCollectionPaymentModel['installNo'],
      "comment": taxCollectionPaymentModel['comment'],
      "isUpdate": true
    };
    // if (taxCollectionPaymentModel['rollYear'] && taxCollectionPaymentModel['tracerNo'] && taxCollectionPaymentModel['installNo'] && taxCollectionPaymentModel['comment']) {
    //   postParams['isUpdate'] = true;
    // }
    this.taxCollectionAsDepositService.paymentComment(postParams).subscribe(response => {
      this.paymentCommentResponse = response;
      if (this.paymentCommentResponse == "Success") {

      }
      console.log(this.paymentCommentResponse)

    }, (err: HttpErrorResponse) => {

    })

  }

  formatedValues(response) {
    let selected
    response.map
  }
  selectedType(key) {
    this.taxCollectionPaymentModel['Report_Date'] = '';
    this.datePickerNgModelKeys['credit_date'] = '';

    switch (key) {
      case 'transaction_Date':
        this.taxCollectionPaymentModel['Deposit_Date'] = 'Y';
        this.taxCollectionPaymentModel['Credit_Date'] = 'N'
        break;
      case 'credit_date':
        this.taxCollectionPaymentModel['Deposit_Date'] = 'N'
        this.datePickerNgModelKeys['transaction_date'] = '';;
        this.taxCollectionPaymentModel['Credit_Date'] = 'Y'
        break;
    }
  }
  onItemSelect(item: any) {
  }

  onSelectAll(event) { }

  selectedAmountType(key) {
    switch (key) {
      case 1:
        this.taxCollectionPaymentModel['Deposit_Amount'] = 'Y';
        this.taxCollectionPaymentModel['Total_Tax_Amount'] = 'N'
        break;
      case 2:
        this.taxCollectionPaymentModel['Deposit_Amount'] = 'N';
        this.taxCollectionPaymentModel['Total_Tax_Amount'] = 'Y'
        break;
    }
  }

  public onSelectNotify(date, key) {
    switch (key) {
      case 'transaction_date':
        this.taxCollectionPaymentModel['Report_Date'] = date;
        this.datePickerNgModelKeys['transaction_date'] = date;
        break;
      case 'credit_date':
        this.taxCollectionPaymentModel['Report_Date'] = date;
        this.datePickerNgModelKeys['credit_date'] = date;
        break;

    }
  }


}


