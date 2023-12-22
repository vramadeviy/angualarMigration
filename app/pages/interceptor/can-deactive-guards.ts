import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeactivateGuardService implements  CanDeactivate<CanComponentDeactivate>{

  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) {
    let url: string = state.url;
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}