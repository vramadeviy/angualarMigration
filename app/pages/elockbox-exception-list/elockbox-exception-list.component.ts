import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ElockboxExceptionService } from './elockbox-exception.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Rx';
import { GlobalTaxToolService } from '../_service/global-taxtools-service';
import { DownloadService } from '../_service/download-service';

declare var $: any;
interface Payload {
  from_date?: string;
  to_date?: string;
  status?: string;
  reason?: string;
  uboc_apn?:string;
}
@Component({
  selector: 'app-elockbox-exception-list',
  templateUrl: './elockbox-exception-list.component.html',
  styleUrls: ['./elockbox-exception-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ElockboxExceptionListComponent implements OnInit, AfterViewInit {
  public searchModel: Payload={
    status:'Not Handled',
    reason:'All'
  };
  public exceptionListData = [];
  public statusList = [{id: 3, type: "All"}];
  public reasonList = [{id: 0, type: "All"}];
  public actionTakenList=[];
  startCalenderDate = { month: new Date().getMonth() + 1, day: new Date().getDate(), year: new Date().getFullYear() };
  expanded;
  public totalExceptionPaymentAmount=0;
  public isUpdateButtonEnabled=false;
  actionStatusUpdate=false;
  exceptionStatusUpdate=false;
  isDateGreatherLessThanFromDate=false;
  private loggedInUserId;
  errorMsg:string;
  public reverse:boolean = true;
  public order='exceptionDate';
  constructor(private elockboxService: ElockboxExceptionService, private _globalService:GlobalTaxToolService,private downloadService:DownloadService) {
    this.loggedInUserId=this._globalService.getData()['userId'];
  }

  ngOnInit() {
    this.initValues();
    this.getInitDropdownValues();
  }
  initValues() {
    var _item = this._globalService.getData();
    const myProfileInfo = _item;
    const previousDay = myProfileInfo['previousDay'];
    this.searchModel['from_date'] = this.FormatDateString(previousDay);
  }
  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);
    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }
  getInitDropdownValues() {
    let queryList = [
      this.elockboxService.getDropdownData('EXCEPTIONSTATUS'),
      this.elockboxService.getDropdownData('EXCEPTIONREASON'),
      this.elockboxService.getDropdownData('ACTIONTAKEN')
    ];
    forkJoin(queryList).subscribe((response: any) => {
      this.statusList =  this.statusList.concat(response[0]);
      this.reasonList = this.reasonList.concat(response[1]);
      this.actionTakenList= response[2];
    }, err => {
      this.statusList = [];
      this.reasonList = [];
    });
  }
  public getExceptionListData(postParams) {
    this.totalExceptionPaymentAmount=0;
    this.exceptionListData = [];
    this.elockboxService.getExceptionListData(postParams).subscribe(response => {
      if(response['item1'].length){
        this.exceptionListData = response['item1'];
        this.exceptionListData.map(item=>{
          item['isTrue']=!item.exceptionStatus? false : true;
          item['exceptionStatus']= !item.exceptionStatus? false : true;
          item['isActionTaken']=!!item.action_Taken;
          item['isComments']=!!item.comments;
          this.totalExceptionPaymentAmount+=item.uboC_PaymentAmount;
        })
      }else{
        const errorMsg= response['item2'] !=='Success'? response['item2']:'No records found';
        this.errorMsg=errorMsg;
      } 
      setTimeout(()=>{
        this.verticalHorizontalScrollConfig();
      });
    }, err => {
      this.exceptionListData = [];
    })
  }

  public onDateSelected(date, type) {
    switch (type) {
      case 'from_date':
        this.searchModel['from_date'] = date;
        break;
      case 'to_date':
        this.searchModel['to_date'] = date;
        break;
    }

  }
  ngAfterViewInit() {
    this.verticalHorizontalScrollConfig();
  }
  /**
* @method verticalHorizontalScrollConfig
* @description Scroll configuration
* @memberof PaymentLookupComponent
*/
  private verticalHorizontalScrollConfig() {
    $("#clscroll-content").scroll(function () {
      $("#clscroll-row-headers").scrollTop($("#clscroll-content").scrollTop());
      // console.log("left");
      $("#clscroll-column-headers").scrollLeft($("#clscroll-content").scrollLeft());
    });

    $("#clscroll-column-headers").scroll(function () {
      $("#clscroll-content").scrollLeft($("#clscroll-column-headers").scrollLeft());
    });

    $("#clscroll-row-headers").scroll(function () {
      // $("#clscroll-content").scrollTop($("#clscroll-row-headers").scrollTop());
    });
  }

  public onSubmit() {
    if(this.isValid()){
      let postParms = {
        "exceptionFromDate": this.searchModel.from_date,
        "exceptionToDate": this.searchModel.to_date ? this.searchModel.to_date : this.searchModel.from_date,
        "exceptionStatus": this.searchModel.status,
        "exceptionReason": this.searchModel.reason,
        "uboC_APN": this.searchModel.uboc_apn ? this.searchModel.uboc_apn : ''
      };
      this.getExceptionListData(postParms);
    }
  }
  private isValid() {
    this.isDateGreatherLessThanFromDate = false;
    if (this.searchModel.from_date) {
      if(this.searchModel.to_date && this.searchModel.to_date!=""){
        const isValidDate = this.isCorrectDate(this.searchModel.to_date);
        if (isValidDate && new Date(this.searchModel.from_date) <= new Date(this.searchModel.to_date)) {
          this.isDateGreatherLessThanFromDate = false;
          return true;
        } else {
          this.isDateGreatherLessThanFromDate = true;
          return false;
        }
      }else{
        return true;
      }
    }
  }
  public toggleDetails(index,type){
    this.expanded = (this.expanded !== index) ? index : "";
  }

  public updateElockbox(){
    let updatedExceptionList=[];
    let isValidUpdate=false;
    if(this.exceptionListData && this.exceptionListData.length){
      try {
        this.exceptionListData.map(response=>{
          if(response.exceptionStatus && !(response.isTrue && response.isActionTaken)){
            if(response.action_Taken){
              updatedExceptionList.push({
                "exceptionDate": response.exceptionDate,
                "uboC_APN": response.uboC_APN,
                "uboC_TracerNo":response.uboC_TracerNo,
                "action_Taken": response.action_Taken,
                "exceptionHandled": response.exceptionStatus,
                "comments": response.comments,
                "resolvedBy": this.loggedInUserId
              })
            }else{
              isValidUpdate=true;
              throw 'error';
            }
          }
        })
      } catch (error) {
        alert('Enter action taken for setting exception to handled');
      }
    }
    if(!isValidUpdate){
      this.updateList(updatedExceptionList);
    }
  }
  updateList(postparams){
    this.elockboxService.updateExceptionList(postparams).subscribe(response=>{
      this.onSubmit();
    },(err)=>{})
  }

  isActionStatusUpdate(item){
      item.exceptionStatus=true;
      this.actionStatusUpdate=true;
      this.exceptionStatusUpdate=true;
  }
  isExceptionStatusUpdate(status){
    this.exceptionStatusUpdate=true;
  }

  downloadCSV() {
    let updateResponse=JSON.parse(JSON.stringify(this.exceptionListData));
    for (var index in updateResponse) { //objArray[0]
      updateResponse[index].uboC_PaymentAmount ="$"+updateResponse[index].uboC_PaymentAmount.toFixed(2);
    }
    let csvData = this.downloadService.ConvertToCSV(updateResponse, this.getTableColumnList());
    this.downloadService.updateFileName('elockbox-exception-report.csv');
    this.downloadService.getBlobCSVData(csvData);
  }
  private getTableColumnList() {
    const tableHeaderArrayList = [{
      'item_id': 'exceptionDate',
      'item_text': 'Exception Date'
    }, {
      'item_id': 'uboC_APN',
      'item_text': 'UBOC APN.'
    }, {
      'item_id': 'uboC_TracerNo',
      'item_text': 'UBOC Tracer No.'
    }, {
      'item_id': 'uboC_BatchNo',
      'item_text': 'UBOC Batch No.'
    }, {
      'item_id': 'uboC_PayerName',
      'item_text': 'Payer Name'
    }, {
      'item_id': 'uboC_PaymentAmount',
      'item_text': 'Payment Amount',
      'number_format':'1.2-2'
    }, {
      'item_id': 'uboC_PaymentDate',
      'item_text': 'Payment Date'
    }, {
      'item_id': 'exception_Reason',
      'item_text': 'Reason for Exception'
    },{
      'item_id': 'exceptionStatus',
      'item_text': 'Exception Handled'
    },{
      'item_id': 'action_Taken',
      'item_text': 'Action taken'
    },{
      'item_id': 'comments',
      'item_text': 'Comments'
    },{
      'item_id': 'resolvedBy',
      'item_text': 'Resolved by'
    },{
      'item_id': 'resolvedDate',
      'item_text': 'Resolved Date'
    }];
    return tableHeaderArrayList;
  }
   /**
  *
  * @method isCorrectDate
  * @description Check Date Validation code and return true or false
  * @param {any} date Post date
  * @memberof PaymentLookupComponent
  */
  public isCorrectDate(date) {
    var regex = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{4})*$/;
    return (regex.test(date));
  }

  setOrder(key){
    if (this.order === key) {
      this.reverse = !this.reverse;
    }

    this.order = key;
  }
}
