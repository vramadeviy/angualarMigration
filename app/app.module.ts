import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { routing } from './app.routing';
import { AppSettings } from './app.settings';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PaymentLookupService } from './pages/payment-lookup/payment-lookup.service';
import { HttpModule } from '@angular/http';
import {GlobalTaxToolService} from './pages/_service/global-taxtools-service'; 
import {HTTPInterceptor} from './pages/interceptor/http.interceptor';
import {CommonService} from './pages/_service/common.service'; 
import { NgbDatepickerPopupModule } from './pages/common-component/ngb-date-picker/datepicker-popup.module';
import { DeactivateGuardService } from './pages/interceptor/can-deactive-guards';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule, 
    BrowserAnimationsModule,
    HttpModule,
    
  ],
  providers: [ AppSettings ,CommonService, PaymentLookupService
    , GlobalTaxToolService,
    {
      provide: HTTP_INTERCEPTORS,
        useClass: HTTPInterceptor,
      multi: true
    },
    DeactivateGuardService
  ],
  bootstrap: [ AppComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
