import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PaymentLookupComponent } from './payment-lookup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {MatRadioModule,MatCheckboxModule} from '@angular/material';
import { PaginationComponent } from '../pagination/pagination.component';
import { MatFormFieldModule } from '@angular/material';
import {Ng2MultiSelectDropDownModule} from '../common-directive/ng-multiselect-dropdown/ng-multiselect-dropdown.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from './filters/pipes.module';
import {FieldErrorDisplayComponent} from  '../field-error-display/field-error-display.component';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { OrderModule } from 'ngx-order-pipe';
import { LimitToDirective}  from '../common-directive/limit-to-directive';
import { FocusDirective } from '../common-directive/auto-focus-directive';
import {NgbDatepickerPopup} from '../common-component/ngb-date-picker/datepicker-popup';
import { NgbDatepickerPopupModule } from '../common-component/ngb-date-picker/datepicker-popup.module';
import { CommonDirectivepModule } from '../common-directive/common-directive.module';
import { Uppercase } from '../common-directive/upper-case.directive';
import { NumberOnlyDirective } from '../common-directive/number.directive';

export const routes = [
  { path: '', component: PaymentLookupComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    Ng2MultiSelectDropDownModule,
    MatRadioModule,MatCheckboxModule,
    MatFormFieldModule,
    NgbModule.forRoot(),
    PipesModule,
    NgxPaginationModule,
    OrderModule,
    NgbDatepickerPopupModule,
    CommonDirectivepModule
  ],  
  declarations: [
    PaymentLookupComponent,
    PaginationComponent,
    FieldErrorDisplayComponent,
    LimitToDirective,
    NumberOnlyDirective
    // NgbDatepickerPopup
  ]
})

export class PaymentLookupModule { }
