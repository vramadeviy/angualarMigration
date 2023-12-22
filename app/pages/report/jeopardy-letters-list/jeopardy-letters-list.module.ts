import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JeopardyLettersListComponent } from './jeopardy-letters-list.component';
import { RouterModule } from '@angular/router';
import { NgbDatepickerPopupModule } from '../../common-component/ngb-date-picker/datepicker-popup.module';
import { FormsModule } from '@angular/forms';
import { SSRSReportViewerModule } from 'ngx-ssrs-reportviewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppCommons } from '../../shared/app.commons';
import { NgbDateFRParserFormatter } from '../../payment-lookup/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '../../common-directive/ngb-date-picker/ngbDateParserFormatter';
import { JeopardyLettersListService } from './jeopardy-letters-list.service';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import {Ng2MultiSelectDropDownModule} from '../../common-directive/ng-multiselect-dropdown/ng-multiselect-dropdown.module'
import { OrderModule } from 'ngx-order-pipe';
import { MultiPropFilter } from './multisearch.pipe';

export const routes = [
  { path: '', component: JeopardyLettersListComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    NgbDatepickerPopupModule,
    FormsModule,
    SSRSReportViewerModule,
    NgxPaginationModule,
    OrderModule,
    Ng2MultiSelectDropDownModule
  ],
  declarations: [JeopardyLettersListComponent,MultiPropFilter],
  providers: [
    AppCommons,
    JeopardyLettersListService,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ]
})
export class JeopardyLettersListModule { }
