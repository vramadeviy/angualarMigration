import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';
import { NgbDatepickerPopup } from '../../common-component/ngb-date-picker/datepicker-popup';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SSRSReportViewerModule
    ],
    declarations: [
        NgbDatepickerPopup
    ],
    exports: [NgbDatepickerPopup]
})

export class NgbDatepickerPopupModule { }
