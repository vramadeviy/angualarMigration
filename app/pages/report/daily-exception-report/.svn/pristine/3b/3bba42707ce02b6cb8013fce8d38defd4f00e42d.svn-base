import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DailyExceptionReportComponent } from "./daily-exception-report.component";
import { RouterModule } from "@angular/router";
import { NgbDatepickerPopupModule } from "./../../common-component/ngb-date-picker/datepicker-popup.module";
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateFRParserFormatter } from "app/pages/common-directive/ngb-date-picker/ngb-date-fr-parser-formatter";
import { HelperCommonMethod } from "app/pages/_service/payment-common";
import { SSRSReportViewerModule } from "ngx-ssrs-reportviewer";
import { FormsModule } from "@angular/forms";

export const routes = [
  { path: "", component: DailyExceptionReportComponent, pathMatch: "full" },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    NgbDatepickerPopupModule,
    SSRSReportViewerModule,
    FormsModule,
    
  ],
  declarations: [DailyExceptionReportComponent],
  providers: [
    HelperCommonMethod,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
  ],
})
export class DailyExceptionReportModule {}
