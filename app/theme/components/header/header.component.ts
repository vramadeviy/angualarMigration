import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { LoginUserService } from '../../../pages/_service/login-user-service';
import { GlobalTaxToolService } from '../../../pages/_service/global-taxtools-service';
import { Menu } from '../menu/menu.model';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService, LoginUserService],
  animations: [
    trigger('showInfo', [
      state('1', style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms', ))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu: boolean = true;
  public showInfoContent: boolean = false;
  public settings: Settings;
  public menuItems: Array<any>;
  loggedIn: boolean;
  firstName: string = ``;
  lastName: string = ``;
  userId: any;
  loginUserInfo: any;
  paymentSearchResults: any;
  // encodedJwtToken: any;
  expiresIn: any;
  //private model = new User('rgadira');
  loadMsg: string = '';
  claims: any = {};
  menuNavId: any;
  users: any = [];
  installPaymentId: any;
  tokenId: any = [];
  userFirstName: any;
  public menuId: String;
  userMenu: any;
  preferenceMenu: any;


  /*******************************************
  Menu id are assigned as following:
 -----------
 10 - Home 
 -----------
 20 - Payments
 -----------
 21 - Payment Lookup
 22 - Update Processed Special Assessment Charges
 23 - Update Rejected Special Assessment Charges
 24 - Certify Special Assessment Charges
 ----------
 30-Reports
 ----------
 31 - Tax Rate Areas in a Class
 32 - Submission Status/Confirmation
 33 - Legend Summary by Primary TRA
 34 - Contacts and Users
 --------
 40-Help
 -----------
 41 - User Manual
 42 - FAQ
 43 - About
 ************************************************/

  /**
   * Creates an instance of HeaderComponent.
   * @param {AppSettings} appSettings 
   * @param {MenuService} menuService 
    * @param {PaymentLookupService} paymentLookupService 
   * @memberof HeaderComponent
   */


  constructor(
    public route: Router,
    public appSettings: AppSettings,
    private loginUserService: LoginUserService,
    public menuService: MenuService,
    private _globalService: GlobalTaxToolService,
    private elementRef: ElementRef
  ) {
    this.settings = this.appSettings.settings;
    this.bindEnvType()
    //  this.getAuthInfo();

  }

  public envType;
  public bindEnvType() {
    let URL = window.location.href;
    if (URL.indexOf('taxtoolst') != -1 || URL.indexOf('localhost') != -1) {
      this.envType = 'Test/QA'
    }
    if (URL.indexOf('taxtoolsd') != -1) {
      this.envType = 'Dev'
    }
    if (URL.indexOf('taxtoolsq') != -1) {
      this.envType = 'Uat'
    }
  }
  /**
   * @method getDynamicNavigationMenu
   * @description which Filter the menu option based on API call response value headerMenuany: String
   * @memberof HeaderComponent data
   */
  getDynamicNavigationMenu(menuItem) {
    if (menuItem) {
      this.userMenu = new Menu(50, this.firstName, null, null, 'user-o', null, true, 0);
      this.preferenceMenu = new Menu(51, 'Preferences', '/preference', null, null, null, null, 50);
      //this.preferenceMenu = new Menu(51, 'Preference', null, null, null, null, null, 50);

      let splitResult = menuItem.split(",");
      let mapIntoNumberArray = splitResult.map(function (x) {
        return parseInt(x);
      })
      var menuObject = this.menuService.getHorizontalMenuItems();
      // this.menuItems = this.homeMenu;

      this.menuItems = menuObject.filter(function (y) {
        if (mapIntoNumberArray.indexOf(y.id) != -1) {

          return y;
        }

      });

      this.menuItems.push(this.userMenu);
      if (mapIntoNumberArray.length > 1)
        this.menuItems.push(this.preferenceMenu);
    }


  };

  private getAuthInfo() {

    this.loginUserService.getUserInfo().subscribe(data => {
      if (data) {
        const landingPageID = data.prefferedLandingPage;
        this._globalService.saveData(data);
        this.loginUserInfo = data;
        this.menuNavId = this.loginUserInfo.screens;
        //this.menuNavId ="10,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39,40,41,42,43,310,311,312,313,314,315,316,317";
        //this.menuNavId = "10,20,21,22,23,24,30,31,32,33,34,35,36,37,40,41,42,43";
        this.userId = this.loginUserInfo.userId;
        this.firstName = this.loginUserInfo.userName;
        this.getDynamicNavigationMenu(this.menuNavId)
        document.getElementById("spinner_loader").style.display = "block";
        document.getElementById("spinner_loader").style.opacity = "1";
        document.getElementById("spinner_loader").style.visibility = "vissble";
        this.menuItems.map(item => {
          if (item['id'] == landingPageID) {
            this.route.navigateByUrl(item.routerLink);
            document.getElementById("spinner_loader").style.display = "none";
            document.getElementById("spinner_loader").style.opacity = "0";
            document.getElementById("spinner_loader").style.visibility = "hidden";
          }
        })
      }

    }, (err) => {
      document.getElementById("spinner_loader").style.display = "none";
      document.getElementById("spinner_loader").style.opacity = "0";
      document.getElementById("spinner_loader").style.visibility = "hidden";
      return err;
    });
  }




  // getUserInfo() {
  //   this._globalService.getData().subscribe(_item=>{
  //     alert("inside header"+_item.screens);
  //     console.log("data",_item);
  //     this.loginUserInfo = _item; 
  //     this.menuNavId = this.loginUserInfo.screens; 
  //     this.userId= this.loginUserInfo.userId;  
  //     this.getDynamicNavigationMenu(this.menuNavId)
  //   })

  // }

  ngOnInit() {
    /** revert ME */
    this.getAuthInfo();
    // this.menuNavId = "10,20,21,22,23,24,30,31,32,33,34,35,36,37,40,41,42,43";
    // this.getDynamicNavigationMenu(this.menuNavId);
    if (window.innerWidth <= 768)
      this.showHorizontalMenu = false;
  }


  public closeSubMenus() {
    let menu = document.querySelector("#menu0");
    if (menu) {
      for (let i = 0; i < menu.children.length; i++) {
        let child = menu.children[i].children[1];
        if (child) {
          if (child.classList.contains('show')) {
            child.classList.remove('show');
            menu.children[i].children[0].classList.add('collapsed');
          }
        }
      }
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.showHorizontalMenu = false;
    }
    else {
      this.showHorizontalMenu = true;
    }
  }

}
