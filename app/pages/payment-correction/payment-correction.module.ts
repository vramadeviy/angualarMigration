import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PaymentCorrectionComponent } from './payment-correction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Ng2MultiSelectDropDownModule} from '../common-directive/ng-multiselect-dropdown/ng-multiselect-dropdown.module'
import { NumberOnlyDirective } from '../common-directive/number.directive';
import { TwoDigitDecimaNumberDirective } from '../common-directive/decimal-directive';

export const routes = [
  { path: '', component: PaymentCorrectionComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2MultiSelectDropDownModule
  ],
  declarations: [
    PaymentCorrectionComponent,
    TwoDigitDecimaNumberDirective
    //  NumberOnlyDirective
  ]
})

export class PaymentCorrectionModule {

  
}
