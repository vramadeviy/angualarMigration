import { Injectable } from '@angular/core'
import { environment } from 'environments/environment.prod';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http'; //added import


@Injectable()
export class ReapplyPaymentService {

  constructor(public http: HttpClient) { }

  getFromTracerReapplyPaymentDetail(year, tracerNo, install_no): Observable<any> {
    return this.http.get(environment.serverUrl + 'api/PaymentReapply/From/' + year + '/' + tracerNo + '/' + install_no)
  }
  getToTracerReapplyPaymentDetail(year, tracerNo, install_no): Observable<any> {
    return this.http.get(environment.serverUrl + 'api/PaymentReapply/To/' + year + '/' + tracerNo + '/' + install_no)
  }

  saveReapplyPayment(object) {
    return this.http.post(environment.serverUrl + 'api/PaymentReapply', object);
  }

  getReaaplyPaymentDetailByID(ID) {
    return this.http.get(environment.serverUrl + 'api/PaymentReapply/Id?ttpinstallPaymentId='+ ID);
  }
}