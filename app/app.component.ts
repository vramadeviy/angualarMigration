import { Component, ViewEncapsulation } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { LoginUserService } from './pages/_service/login-user-service';
import { GlobalTaxToolService } from './pages/_service/global-taxtools-service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [LoginUserService],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    public settings: Settings;
    constructor
        (public appSettings: AppSettings,
        private router: Router,
        private loginUserService: LoginUserService,
        private _globalTaxToolService: GlobalTaxToolService,
    ) {
        this.settings = this.appSettings.settings;
       // this.getAuthInfo();
       console.log(this._globalTaxToolService.ClientAppVersion);
    }

    ngOnInit() {
        this.router.navigate([''])
      }

    // private getAuthInfo() {
    //     this.loginUserService.getUserInfo().subscribe(data => {
    //         this._globalTaxToolService.saveData(data);

    //     });
    // }
}
