import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalTaxToolService } from '../_service/global-taxtools-service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {

  public versionDetails = {};
  constructor(public globalTaxToolService:GlobalTaxToolService) { }

  ngOnInit() {
    this.versionDetails = this.globalTaxToolService.getVersionDetails();
  }

}
