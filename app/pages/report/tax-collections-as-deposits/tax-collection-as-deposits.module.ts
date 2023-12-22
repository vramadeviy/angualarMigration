import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerPopupModule } from '../../common-component/ngb-date-picker/datepicker-popup.module';
import { MatRadioModule,  MatFormFieldModule } from '@angular/material';
import { Ng2MultiSelectDropDownModule } from '../../common-directive/ng-multiselect-dropdown';
import { TaxCollectionAsDepositsComponent } from './tax-collection-as-deposits.component';

export const routes = [
  { path: '', component: TaxCollectionAsDepositsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgbModule.forRoot(),    
    FormsModule,
    NgbModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule,
    SSRSReportViewerModule,
    Ng2MultiSelectDropDownModule,
    NgbDatepickerPopupModule
  ],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TaxCollectionAsDepositsComponent),
    }
  ],
  declarations: [
    TaxCollectionAsDepositsComponent
]
})
export class TaxCollectionAsDepositsModule { }

