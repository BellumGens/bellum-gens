import { Component, OnInit, ViewChild, Inject, PLATFORM_ID, LOCALE_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgOptimizedImage } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  IgxBannerComponent,
  IgxNavigationDrawerComponent,
  IgxLayoutDirective,
  IgxNavDrawerTemplateDirective,
  IgxNavDrawerItemDirective,
  IgxRippleDirective,
  IgxIconComponent,
  IgxNavDrawerMiniTemplateDirective,
  IgxFlexDirective,
  IgxNavbarComponent,
  IgxNavbarActionDirective,
  IgxBannerActionsDirective,
  IgxButtonDirective,
  IgxDividerDirective,
  IgxIconService,
  changei18n
} from '@infragistics/igniteui-angular';
import { battlenet, discord, facebook, heartCare, instagram, linkedin, steam, twitch, twitter, youtube } from '@igniteui/material-icons-extended';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';

import { LoginService, ApplicationUser } from '../../../common/src/public_api';
import { environment } from '../../../common/src/environments/environment';
import { SuccessErrorComponent } from '../../../common/src/lib/success-error/success-error.component';
import { LoginComponent } from '../../../common/src/lib/login/login.component';
import { LanguagesComponent } from '../../../common/src/lib/languages/languages.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
      IgxLayoutDirective,
      IgxNavigationDrawerComponent,
      IgxNavDrawerTemplateDirective,
      IgxNavDrawerItemDirective,
      IgxRippleDirective,
      RouterLink,
      IgxIconComponent,
      RouterLinkActive,
      NgIf,
      IgxNavDrawerMiniTemplateDirective,
      IgxFlexDirective,
      IgxNavbarComponent,
      IgxNavbarActionDirective,
      NgOptimizedImage,
      LanguagesComponent,
      LoginComponent,
      IgxBannerComponent,
      IgxBannerActionsDirective,
      IgxButtonDirective,
      SuccessErrorComponent,
      RouterOutlet,
      IgxDividerDirective
    ]
})
export class AppComponent implements OnInit {
  @ViewChild('cookiesBanner', { static: true })
  private banner: IgxBannerComponent;

  @ViewChild('drawer', { static: true })
  private navdrawer: IgxNavigationDrawerComponent;

  public authUser: ApplicationUser;
  public environment = environment;
  public year = new Date().getFullYear();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Inject(LOCALE_ID) private localeId: string,
              private iconService: IgxIconService,
              private authManager: LoginService,
              private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.authManager.applicationUser.subscribe(data => {
        this.authUser = data;
      });
      this.initSvgIcons();
    }
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!window?.localStorage?.getItem('cookiesAccepted')) {
        this.banner.open();
      }

      this.router.events.pipe(
        filter(x => x instanceof NavigationEnd)
      ).subscribe(() => this.navdrawer.close());
    }
  }

  public acceptCookies() {
    this.banner.close();
    window.localStorage.setItem('cookiesAccepted', 'true');
  }

  private initSvgIcons() {
    const complogos = [discord, steam, twitch, battlenet, facebook, twitter, instagram, linkedin, youtube];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c.name, c.value, 'login-icons'));
    this.iconService.addSvgIconFromText(heartCare.name, heartCare.value, 'health-icons');

    //this.iconService.addSvgIcon('isobar', '/assets/partners/isobar.svg', 'partners');
    //this.iconService.addSvgIcon('vmware', '/assets/partners/vmware.svg', 'partners');
    //this.iconService.addSvgIcon('telus', '/assets/partners/telus.svg', 'partners');
    //this.iconService.addSvgIcon('modis', '/assets/partners/modis.svg', 'partners');
    //this.iconService.addSvgIcon('omen', '/assets/partners/omen.svg', 'partners');
    //this.iconService.addSvgIcon('paysafe', '/assets/partners/paysafe.svg', 'partners');

    this.iconService.addSvgIcon('en', '/assets/country-flags/svg/united-kingdom.svg', 'languages');
    this.iconService.addSvgIcon('bg', '/assets/country-flags/svg/bulgaria.svg', 'languages');

    if (this.localeId === 'bg') {
      changei18n(IgxResourceStringsBG);
    }
  }
}
