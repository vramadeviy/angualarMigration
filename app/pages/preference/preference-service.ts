
import { Injectable } from '@angular/core';

//import {taxLookupTableHeaderData} from './preference-header-list';
// import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient} from '@angular/common/http'; //added import
import { Observable } from 'rxjs/Rx';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';


@Injectable()
    export class PreferenceService {
        constructor( private http: HttpClient){

        }
       
        public setPreferencePageTableHeader(postParam): Observable<any> {
         return this.http.post(environment.serverUrl + 'api/UserPreference',postParam);
          }
    }