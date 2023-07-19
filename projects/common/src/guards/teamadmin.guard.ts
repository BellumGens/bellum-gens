import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TeamadminGuard  {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: string, private authService: LoginService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public canActivate(
    next: ActivatedRouteSnapshot) {
    return this.isBrowser ? this.isTeamAdmin(next.parent.params.teamid) : true;
  }

  public isTeamAdmin(teamid: string) {
    return this.authService.getUserIsTeamAdmin(teamid);
  }
}
