import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TransactionRegisterComponent } from './transaction-register.component';
import { NgbDatepickerPopup } from '../../common-component/ngb-date-picker/datepicker-popup';
import { NgbDatepickerPopupModule } from '../../common-component/ngb-date-picker/datepicker-popup.module';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';

export const routes = [
  { path: '', component: TransactionRegisterComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgbModule.forRoot(),    
    FormsModule,
    NgbDatepickerPopupModule,
    SSRSReportViewerModule
  ],
  declarations: [
    TransactionRegisterComponent
]
})

export class TransactionRegisterModule { }
