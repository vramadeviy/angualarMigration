import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';
import { environment } from "environments/environment";
//import { environment } from "environments/environment.prod";


@Injectable()
export class CurrentSecuredService {
    constructor(private http: HttpClient) { }
    getReportHistory(postParams): Observable<any> {
        return this.http.post(environment.serverUrl + 'api/Reports/ReportHistory', postParams)
    }

    getCertifyData(GUID): Observable<any> {
        return this.http.get(environment.serverUrl + 'api/APPTN/GetCertifyData/' + GUID)
    }
    saveCertifyData(payload): Observable<any> {
        return this.http.post(environment.serverUrl + 'api/APPTN/SaveCertifyData', payload)
    }
    getPrivilege(payload): Observable<any> {
        return this.http.post(environment.serverUrl +
            'api/APPTN/GetPrivilege/' + payload.userName + '/'
            + environment.currentEnvironment, {});
            
        // 'api/APPTN/GetPrivilege/'+payload.userName+'/'+payload.PrivilegeName,{})
    }
    getApptnYearList(): Observable<any> {
        return this.http.get(environment.serverUrl + 'api/APPTN/GetApptnYearList')
    }
}