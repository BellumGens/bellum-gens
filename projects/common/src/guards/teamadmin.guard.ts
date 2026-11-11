import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from 'bellum-gens-common/services';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TeamadminGuard  {
  private authService = inject(LoginService);

  private isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
  }

  public canActivate(
    next: ActivatedRouteSnapshot) {
    if (!this.isBrowser) {
      return true;
    }
    const teamId: string | undefined = next.parent?.params['teamid'];
    return teamId ? this.isTeamAdmin(teamId) : false;
  }

  public isTeamAdmin(teamid: string) {
    return this.authService.getUserIsTeamAdmin(teamid);
  }
}
