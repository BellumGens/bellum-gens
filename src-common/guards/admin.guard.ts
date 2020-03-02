import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: string, private authService: LoginService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isBrowser ? this.isAppAdmin() : true;
  }

  isAppAdmin() {
    return this.authService.getUserIsAppAdmin();
  }
}
