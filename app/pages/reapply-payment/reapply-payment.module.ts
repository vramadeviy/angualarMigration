import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ReapplyPaymentComponent } from './reapply-payment.component';
import { NumbersDirective } from '../common-directive/number.numeric-directive';
import { CommonDirectivepModule } from '../common-directive/common-directive.module';
import { FocusDirective } from '../common-directive/auto-focus-directive';
import { DeactivateGuardService } from '../interceptor/can-deactive-guards';
export const routes = [
  { path: '', component: ReapplyPaymentComponent, pathMatch: 'full',
  canDeactivate:[DeactivateGuardService] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonDirectivepModule
    
  ],
  declarations: [
    ReapplyPaymentComponent,
  
]
})

export class ReapplyPaymentModule { }
