import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, LOCALE_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLinkActive, RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';

import {
  PositionSettings,
  HorizontalAlignment,
  OverlaySettings,
  IgxDropDownComponent,
  IgxInputGroupComponent,
  AutoPositionStrategy,
  IgxBannerComponent,
  IgxLayoutDirective,
  IgxNavigationDrawerComponent,
  IgxNavDrawerTemplateDirective,
  IgxNavDrawerItemDirective,
  IgxRippleDirective,
  IgxIconComponent,
  IgxBadgeComponent,
  IgxDividerDirective,
  IgxNavDrawerMiniTemplateDirective,
  IgxFlexDirective,
  IgxNavbarComponent,
  IgxNavbarActionDirective,
  IgxPrefixDirective,
  IgxLabelDirective,
  IgxInputDirective,
  IgxSuffixDirective,
  IgxBannerActionsDirective,
  IgxButtonDirective,
  IgxIconService,
  changei18n
} from '@infragistics/igniteui-angular';

import {
  LoginService,
  ApplicationUser,
  BellumgensApiService,
  SearchResult,
  GLOBAL_OVERLAY_SETTINGS,
  CSGOTeam,
  ApiSearchService,
  CommunicationService
} from '../../../common/src/public_api';

import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { environment } from '../../../common/src/environments/environment';
import { SuccessErrorComponent } from '../../../common/src/lib/success-error/success-error.component';
import { QuickSearchComponent } from './search/quick-search/quick-search.component';
import { SearchComponent } from './search/search/search.component';
import { LoginComponent } from '../../../common/src/lib/login/login.component';
import { LanguagesComponent } from '../../../common/src/lib/languages/languages.component';
import { battlenet, discord, facebook, heartCare, instagram, linkedin, steam, tiktok, twitch, twitter, youtube } from '@igniteui/material-icons-extended';
import { IgxResourceStringsBG } from 'igniteui-angular-i18n';

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
    RouterLinkActive,
    RouterLink,
    IgxIconComponent,
    IgxBadgeComponent,
    IgxDividerDirective,
    IgxNavDrawerMiniTemplateDirective,
    IgxFlexDirective,
    IgxNavbarComponent,
    IgxNavbarActionDirective,
    IgxInputGroupComponent,
    IgxPrefixDirective,
    IgxLabelDirective,
    IgxInputDirective,
    IgxSuffixDirective,
    LanguagesComponent,
    LoginComponent,
    IgxBannerComponent,
    IgxBannerActionsDirective,
    IgxButtonDirective,
    SearchComponent,
    IgxDropDownComponent,
    QuickSearchComponent,
    SuccessErrorComponent,
    RouterOutlet
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('quickSearch', { static: true }) public quickSearchDropDown: IgxDropDownComponent;
  @ViewChild('searchGroup', { static: true }) public searchGroup: IgxInputGroupComponent;
  @ViewChild('searchInput', { static: true }) public searchInput: ElementRef;
  @ViewChild('cookiesBanner', { static: true }) public banner: IgxBannerComponent;

  public authUser: ApplicationUser;
  public teams: CSGOTeam [];
  public searchResult: SearchResult;
  public unreadNotifications = 0;
  public environment = environment;
  public year = new Date().getFullYear();

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Inject(LOCALE_ID) private localeId: string,
              private iconService: IgxIconService,
              private authManager: LoginService,
              private apiService: BellumgensApiService,
              private searchService: ApiSearchService,
              private notificationService: CommunicationService,
              private activatedRoute: ActivatedRoute) {
    if (isPlatformBrowser(this.platformId)) {
      this.authManager.applicationUser.subscribe(user => {
          this.authUser = user;
          if (user) {
            this.authManager.userNotifications.subscribe(data => this.unreadNotifications += this.unreadPipe.transform(data));
            this.apiService.getUserTeams(user.id).subscribe(teams => this.teams = teams);
          }
        }
      );
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
      if (!window.localStorage.getItem('cookiesAccepted')) {
        this.banner.open();
      }

      this.initQuickSearch();
    }
  }

  public acceptCookies() {
    this.banner.close();
    window.localStorage.setItem('cookiesAccepted', 'true');
  }

  public notificationsLoaded(args: number) {
    this.unreadNotifications += args;
  }

  private initSvgIcons() {
    const complogos = [discord, steam, twitch, battlenet, facebook, twitter, instagram, linkedin, tiktok, youtube];
    complogos.forEach(c => this.iconService.addSvgIconFromText(c.name, c.value, 'login-icons', true));
    this.iconService.addSvgIconFromText(heartCare.name, heartCare.value, 'health-icons');

    this.iconService.addSvgIcon('bge-white', '/assets/login/bge-white-2024.svg', 'partners');
    this.iconService.addSvgIcon('eb-league-white', '/assets/login/eb-league-white.svg', 'partners');
    this.iconService.addSvgIcon('bg-logo', '/assets/bg-logo.svg', 'partners');
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

  private initQuickSearch() {
    const input = fromEvent(this.searchInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (e.currentTarget as HTMLInputElement).value));
    const debouncedInput = input.pipe(debounceTime(300));
    debouncedInput.subscribe(val => {
      if (val.length) {
        const positionSettings: PositionSettings = {
          horizontalDirection: HorizontalAlignment.Left,
          horizontalStartPoint: HorizontalAlignment.Right
        };
        const overlaySettings: OverlaySettings = {
          positionStrategy: new AutoPositionStrategy(positionSettings),
          modal: false,
          target: this.searchGroup.element.nativeElement
        };
        this.quickSearchDropDown.open(overlaySettings);
        this.searchService.quickSearch(val);
      }
    });
  }
}
