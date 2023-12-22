import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerPopupModule } from '../common-component/ngb-date-picker/datepicker-popup.module';
import { HelperCommonMethod } from '../_service/payment-common';
import { NgbDateParserFormatter } from '../common-directive/ngb-date-picker/ngbDateParserFormatter';
import { NgbDateFRParserFormatter } from '../payment-lookup/ngb-date-fr-parser-formatter';
import { ReversalExceptionComponent } from './reversal-exception.component';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';

export const routes = [
  { path: "", component: ReversalExceptionComponent, pathMatch: "full" },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    NgbDatepickerPopupModule,
    FormsModule,
    OrderModule
  ],
  declarations: [ReversalExceptionComponent],
  providers: [
    HelperCommonMethod,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ],
})
export class ReversalExceptionModule { }
