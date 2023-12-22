import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';
import { PreferenceComponent } from './preference.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { FormWizardModule } from '../common-directive/multi-stepper-lib/multi-steps.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {Ng2MultiSelectDropDownModule} from '../common-directive/ng-multiselect-dropdown/ng-multiselect-dropdown.module'
export const routes = [
  { path: '', component: PreferenceComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    MatCheckboxModule,
    FormsModule,
    TooltipModule,
    Ng2MultiSelectDropDownModule,
  
  ],  
  declarations: [
    PreferenceComponent

  ],

})

export class PreferenceModule { }
