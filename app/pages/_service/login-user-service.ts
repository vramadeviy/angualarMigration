import { Injectable } from '@angular/core';
// import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
//import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http'; //added import
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LoginUserInfo } from '../_service/login-user-info';
import { Observable } from 'rxjs/Rx';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {environment} from '../../../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { of } from 'rxjs/observable/of';


@Injectable()
export class LoginUserService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {
      // console.log(this.reportViewer);
  }
  
  progress$: Observable<number>;
  progress: number = 0;
  progressObserver: any;
  endPointUrl: String =  environment.serverUrl;  
  reportViewer : string = environment.reportViewer;  

  get(): Observable<any> {
    return this.http.get('./assets/data/lookup.json');
  }
 
  getUserInfo(): Observable<any> {
  // return of({
  //     "screens": "10,20,21,22,23,24,26,30,40,41,42,43,301,311,316,321,331,341,351,361,3010,3011,3012,3013,3014,3015,3016,3017,3110,3111,3112,3113,3210,3211,3310",
  //     "userId": "cpakalapati",
  //     "userName": "Chikky",
  //     "paymentLookupHeaders": [
  //         "apn",
  //         "transactionDate",
  //         "creditDate",
  //         "depositDate",
  //         "paymentSource",
  //         "tracerNo",
  //         "batchNo",
  //         "installNo",
  //         "paymentStatus",
  //         "reason",
  //         "taxAmountPaid",
  //         "penaltyAmount",
  //         "interestAmount",
  //         "costAmount",
  //         "totalAmount",
  //         "paymentFiscalYear",
  //         "taxBillFiscalYear",
  //         "taxType",
  //         "supplementalType",
  //         "batchAgencyName",
  //         "tellerNo",
  //         "ncrSequenceNo",
  //         "checkNo",
  //         "paymentMethod",
  //         "methodType",
  //         "createdBy",
  //         "createdDate"
  //     ],
  //     "prefferedLandingPage": 10,
  //     "previousDay": "2023-07-14T11:10:46",
  //     "currentRollYear": 2022
  // });
     return this.http.get(this.endPointUrl + 'api/UserLogin/Login')
       //.map(this.extractData)
      // .catch(this.handleError)
  }

  
  // private handleError(error: Response) {
  //   if (error.status === 401 || error.status === 500 || error.status === 403) {
  //     location.href = '/#/home';
  //   }
  //   return Observable.throw(error.json() || 'Server Error');
  // }
 
  // private extractData(res: Response) {
  //   let body = res.json();
  //   return body || [];
  // }

  public getObserver(): Observable<number> {
    return this.progress$;
  }


}