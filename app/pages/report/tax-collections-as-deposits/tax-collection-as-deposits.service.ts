import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';
import { environment } from "environments/environment.prod";


@Injectable()
export class TaxCollectionAsDepositService {
    constructor(private http: HttpClient) { }
   
    paymentComment(postParams): Observable<any> {
        return this.http.post(environment.serverUrl + 'api/Reports/PaymentComment',postParams)
    }
}