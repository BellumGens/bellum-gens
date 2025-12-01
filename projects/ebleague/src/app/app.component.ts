import { Component, OnInit, ViewChild, PLATFORM_ID, LOCALE_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { IgxNavDrawerItemDirective, IgxNavDrawerMiniTemplateDirective, IgxNavDrawerTemplateDirective, IgxNavigationDrawerComponent } from '@infragistics/igniteui-angular/navigation-drawer';
import { IgxDividerDirective, IgxFlexDirective, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IgxNavbarActionDirective, IgxNavbarComponent } from '@infragistics/igniteui-angular/navbar';
import { changei18n } from '@infragistics/igniteui-angular/core';
import { battlenet, discord, facebook, heartCare, instagram, linkedin, steam, twitch, twitter, youtube } from '@igniteui/material-icons-extended';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';

import { LoginService, ApplicationUser, CommunicationService } from '../../../common/src/public_api';
import { environment } from '../../../common/src/environments/environment';
import { SuccessErrorComponent } from '../../../common/src/lib/success-error/success-error.component';
import { LoginComponent } from '../../../common/src/lib/login/login.component';
import { LanguagesComponent } from '../../../common/src/lib/languages/languages.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    IgxLayoutDirective,
    IgxNavigationDrawerComponent,
    IgxNavDrawerTemplateDirective,
    IgxNavDrawerItemDirective,
    IgxRippleDirective,
    RouterLink,
    IgxIconComponent,
    RouterLinkActive,
    IgxNavDrawerMiniTemplateDirective,
    IgxFlexDirective,
    IgxNavbarComponent,
    IgxNavbarActionDirective,
    NgOptimizedImage,
    LanguagesComponent,
    LoginComponent,
    SuccessErrorComponent,
    RouterOutlet,
    IgxDividerDirective
  ]
})
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private localeId = inject(LOCALE_ID);
  private iconService = inject(IgxIconService);
  private authManager = inject(LoginService);
  private notificationService = inject(CommunicationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // @ViewChild('cookiesBanner', { static: true })
  // private banner: IgxBannerComponent;

  @ViewChild('drawer', { static: true })
  private navdrawer: IgxNavigationDrawerComponent;

  public authUser: ApplicationUser;
  public environment = environment;
  public year = new Date().getFullYear();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.authManager.applicationUser.subscribe(data => {
        this.authUser = data;
      });
      this.activatedRoute.queryParams.subscribe(params => {
        if (params?.message) {
          this.notificationService.emitSuccess(params.message);
        }
      });
    }
    this.initSvgIcons();
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // if (!window?.localStorage?.getItem('cookiesAccepted')) {
      //   this.banner.open();
      // }

      this.router.events.pipe(
        filter(x => x instanceof NavigationEnd)
      ).subscribe(() => this.navdrawer.close());
    }
  }

  // public acceptCookies() {
  //   this.banner.close();
  //   window.localStorage.setItem('cookiesAccepted', 'true');
  // }

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
