import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearEndSupplementalReportComponent } from './year-end-supplemental-report.component';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';
import { RouterModule } from '@angular/router';
import { NgbDatepickerPopupModule } from '../../common-component/ngb-date-picker/datepicker-popup.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes = [
  { path: '', component: YearEndSupplementalReportComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    SSRSReportViewerModule,
    FormsModule,
    NgbModule.forRoot(),        
    RouterModule.forChild(routes),
    NgbDatepickerPopupModule
  ],
  declarations: [YearEndSupplementalReportComponent]
})
export class YearEndSupplementalReportModule { }

// use this in the drop down in UI
// Year-End Supplemental Pending Paid Report 