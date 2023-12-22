import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { MatRadioModule, MatCheckboxModule } from '@angular/material';
import { DoublePaymentStatusComponent } from './double-payment-status.component';
export const routes = [
  { path: '', component: DoublePaymentStatusComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    MatRadioModule, MatCheckboxModule,
  ],
  declarations: [
    DoublePaymentStatusComponent


  ]
})

export class DoublePaymentStatusModule { }
