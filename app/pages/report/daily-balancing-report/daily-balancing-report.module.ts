import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerPopup } from '../../common-component/ngb-date-picker/datepicker-popup';
import { NgbDatepickerPopupModule } from '../../common-component/ngb-date-picker/datepicker-popup.module';
import { MatRadioModule,  MatFormFieldModule } from '@angular/material';
import { Ng2MultiSelectDropDownModule } from '../../common-directive/ng-multiselect-dropdown';
import { DailyBalancingReportComponent } from './daily-balancing-report.component';
export const routes = [
  { path: '', component: DailyBalancingReportComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgbModule.forRoot(),    
    FormsModule,
    ReactiveFormsModule,
    SSRSReportViewerModule,
    NgbDatepickerPopupModule
  ],
  declarations: [
    DailyBalancingReportComponent
]
})

export class  DailyBalancingReportModule { }
