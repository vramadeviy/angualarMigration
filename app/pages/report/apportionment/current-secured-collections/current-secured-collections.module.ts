import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';
import { CurrentSecuredCollectionsComponent } from './current-secured-collections.component';
export const routes = [
  { path: '', component: CurrentSecuredCollectionsComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule, 
    FormsModule,
    ReactiveFormsModule,
    SSRSReportViewerModule,
  ],
  declarations: [CurrentSecuredCollectionsComponent]
})
export class CurrentSecuredCollectionsModule { }
