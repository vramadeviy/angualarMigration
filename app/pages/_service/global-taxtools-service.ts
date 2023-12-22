import { Component, Injectable,Input,Output,EventEmitter } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LoginUserInfo } from '../_service/login-user-info';
import 'rxjs/add/operator/map';


// export interface taxToolInfoData {
//     paymentLookupHeaders: any,
//     prefferedLandingPage: string,
//     screens: string,
//     userId: string,
//     userName: string
// }


// @Injectable() 
// export class GlobalTaxToolService {

//   sharingData: Observable<taxToolInfoData[]>

//   private _sharingData: BehaviorSubject<taxToolInfoData[]>;
  

//   private dataStore: {
//     sharingData: taxToolInfoData[]
//   };


//   constructor() {
//     this.dataStore = { sharingData: [] };
//     this._sharingData = <BehaviorSubject<taxToolInfoData[]>>new BehaviorSubject([]);
//   }

//   saveData( userData ) {
//     this._sharingData.next(userData); 
//   }
//   getData()  {
//     return this._sharingData.asObservable();
//   }


// }

 

// export interface taxToolInfoData {
//     paymentLookupHeaders: any,
//     prefferedLandingPage: string,
//     screens: string,
//     userId: string,
//     userName: string
// }


@Injectable() 
// export class GlobalTaxToolService {

//   sharingData: Observable<LoginUserInfo>

//   private _sharingData: BehaviorSubject<LoginUserInfo>;
  
//   constructor() {
//     this._sharingData = <BehaviorSubject<LoginUserInfo>>new BehaviorSubject({});
//   }

//   saveData( userData ) {
//     this._sharingData.next(userData); 
//   }
  
//   getData()  {
//     return this._sharingData.asObservable();
//   }
// }
export class GlobalTaxToolService {
   ClientAppVersion = "0.0.1";
   buildDate= "2023-01-18";
   environment= 'QA';
  private _sharingData: LoginUserInfo;  
  
  saveData( userData ) {
    this._sharingData = userData; 
  }
  
  getData()  {
    return this._sharingData;
  }
  FormatDateString(value) {
    var retPrevDate;
    let newtDate = new Date(value);

    return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
  }

  getVersionDetails(){
    return {
      version:this.ClientAppVersion,
      buildDate:this.buildDate,
      environment:this.environment
    }
  }
}