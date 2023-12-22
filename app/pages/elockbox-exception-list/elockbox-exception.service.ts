import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from 'environments/environment';

@Injectable()
export class ElockboxExceptionService {

  constructor(private http: HttpClient) { }

  getExceptionListData(postParam): Observable<any> {
    return this.http.post(environment.serverUrl + 'api/eLockbox/GetExceptionListData', postParam);
  }
  getDropdownData(type): Observable<any> {
    return this.http.get<any>(environment.serverUrl + 'api/eLockbox/GetDropdownData/' + type);
  }
  updateExceptionList(postParam): Observable<any> {
    return this.http.post(environment.serverUrl + 'api/eLockbox/UpdateExceptionList', postParam);
  }
}
