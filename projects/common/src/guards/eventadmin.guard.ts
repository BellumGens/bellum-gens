import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EventAdminGuard  {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: string, private authService: LoginService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public canActivate() {
    return this.isBrowser ? this.isEventAdmin() : true;
  }

  public isEventAdmin() {
    return this.authService.getUserIsTournamentAdmin();
  }
}
