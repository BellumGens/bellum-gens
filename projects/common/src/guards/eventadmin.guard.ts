import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EventAdminGuard  {
  private authService = inject(LoginService);

  private isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
  }

  public canActivate() {
    return this.isBrowser ? this.isEventAdmin() : true;
  }

  public isEventAdmin() {
    return this.authService.getUserIsTournamentAdmin();
  }
}
