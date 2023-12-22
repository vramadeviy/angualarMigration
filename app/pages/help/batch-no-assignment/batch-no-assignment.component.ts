
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-batch-no-assignment.component',
  templateUrl: './batch-no-assignment.component.html',
  styleUrls: ['./batch-no-assignment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BatchNoAssignmentComponent implements OnInit {
    pdfUrl:any='/assets/data/batch-Number-Assignments.pdf';
    innerHtml:any;
    constructor(public domSanitizer:DomSanitizer){
        this.setInnerHtml(this.pdfUrl);
    }
    ngOnInit(){
      
    }
    public setInnerHtml(pdfurl: string) {
        this.innerHtml = this.domSanitizer.bypassSecurityTrustHtml(
            "<object style='width:100%;height:calc(100vh - 160px)' data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
            "Object " + pdfurl + " failed" +
            "</object>");
    }
}