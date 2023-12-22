
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-guide.component',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserGuideComponent implements OnInit {
    pdfUrl:any='/assets/data/Tax-Tools-User-Guide.pdf';
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