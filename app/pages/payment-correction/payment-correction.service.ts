import {Injectable} from '@angular/core'
import { environment } from 'environments/environment.prod';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import {PaymentCorrectionSearchDetails} from './PaymentCorrectionSearchDetails';
import { HttpClient} from '@angular/common/http'; //added import


@Injectable()
export class PaymentCorrectionService {
    constructor(
        private http : HttpClient
    ){}
    endPointURL : string = environment.serverUrl;

    getSearchResult(id) : Observable<any> {
        return this.http.get(this.endPointURL +'api/PaymentCorrection/Id?installPaymentId=' + id );
    }
    getPaymentCorrectionSearchResult(rollYear,tracerNo, installNo) : Observable<any> {
        return this.http.get(this.endPointURL + 'api/PaymentCorrection' + '/' + rollYear  +'/' + tracerNo + '/' + installNo);
    }
    // savePaymentDetailchange_old(postParam) : Observable<any> {
    //     return this.http.post(this.endPointURL + 'api/PaymentCorrection' ,postParam);
    // }

    savePaymentDetailchange(postParam) : Observable<any> {
        return this.http.post(this.endPointURL + 'api/PaymentCorrection' ,postParam);
    }

    getBatchAgencyCount(postParam) : Observable<any> {
       // return this.http.post(this.endPointURL + 'api/PaymentCorrection' ,postParam);
       return this.http.post(this.endPointURL + 'api/PaymentCorrection/BatchAgency',postParam);
       //return this.http.post(this.endPointURL + '/api/PaymentCorrection/BatchAgency' ,postParam);
    }

    getBatchAgencyList() : Observable<any> {
        return this.http.get(this.endPointURL + 'api/PaymentCorrection/BatchAgencyList');
    }
}