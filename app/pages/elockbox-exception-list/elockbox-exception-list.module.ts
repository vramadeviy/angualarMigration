import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElockboxExceptionListComponent } from './elockbox-exception-list.component';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelperCommonMethod } from '../_service/payment-common';
import { TransactionRegisterService } from '../report/transaction-register/transaction-register.service';
import { AppCommons } from '../shared/app.commons';
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbDatepickerPopupModule } from '../common-component/ngb-date-picker/datepicker-popup.module';
import { NgbDateFRParserFormatter } from "../common-directive/ngb-date-picker/ngb-date-fr-parser-formatter"
import { ElockboxExceptionService } from './elockbox-exception.service';
import { DownloadService } from '../_service/download-service';
import { OrderModule } from 'ngx-order-pipe';
export const routes = [
  { path: '', component: ElockboxExceptionListComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerPopupModule,
    OrderModule
  ],
  declarations: [ElockboxExceptionListComponent],
  providers: [
    HelperCommonMethod,
    TransactionRegisterService,
    ElockboxExceptionService,
    DownloadService,
    AppCommons,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ]
})
export class ElockboxExceptionListModule { }
