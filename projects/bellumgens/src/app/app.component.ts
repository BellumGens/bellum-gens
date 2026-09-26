import { Component, ElementRef, PLATFORM_ID, LOCALE_ID, Signal, afterNextRender, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLinkActive, RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';

import { AutoPositionStrategy, HorizontalAlignment, OverlaySettings, PositionSettings, changei18n } from '@infragistics/igniteui-angular/core';
import { IgxDropDownComponent } from '@infragistics/igniteui-angular/drop-down';
import { IgxInputDirective, IgxInputGroupComponent, IgxLabelDirective, IgxPrefixDirective, IgxSuffixDirective } from '@infragistics/igniteui-angular/input-group';
import { IgxBannerActionsDirective, IgxBannerComponent } from '@infragistics/igniteui-angular/banner';
import { IgxButtonDirective, IgxDividerComponent, IgxFlexDirective, IgxLayoutDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxNavDrawerItemDirective, IgxNavDrawerMiniTemplateDirective, IgxNavDrawerTemplateDirective, IgxNavigationDrawerComponent } from '@infragistics/igniteui-angular/navigation-drawer';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IgxNavbarActionDirective, IgxNavbarComponent } from '@infragistics/igniteui-angular/navbar';

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
import { battlenet, discord, facebook, heartCare, instagram, linkedin, steam, tiktok, twitch, twitter, youtube, github } from '@igniteui/material-icons-extended';
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
    IgxDividerComponent,
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
export class AppComponent {
  private platformId = inject(PLATFORM_ID);
  private localeId = inject(LOCALE_ID);
  private iconService = inject(IgxIconService);
  private authManager = inject(LoginService);
  private apiService = inject(BellumgensApiService);
  private searchService = inject(ApiSearchService);
  private notificationService = inject(CommunicationService);
  private activatedRoute = inject(ActivatedRoute);

  public quickSearchDropDown = viewChild.required<IgxDropDownComponent>('quickSearch');
  public searchGroup = viewChild.required<IgxInputGroupComponent>('searchGroup');
  public searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  // public banner = viewChild.required<IgxBannerComponent>('cookiesBanner');

  private isBrowser = isPlatformBrowser(this.platformId);
  // The user is only looked up in the browser.
  public authUser: Signal<ApplicationUser> = this.isBrowser ? this.authManager.applicationUser : signal<ApplicationUser>(null).asReadonly();
  public teams = signal<CSGOTeam []>(null);
  public searchResult: SearchResult;
  public searchTerm = signal('');
  // Unread notifications cached by the LoginService plus any changes reported by the notifications view.
  private unreadNotificationsDelta = signal(0);
  private serviceUnreadNotifications = computed(() =>
    this.authUser() ? this.unreadPipe.transform(this.authManager.userNotifications()) : 0
  );
  public unreadNotifications = computed(() => this.serviceUnreadNotifications() + this.unreadNotificationsDelta());
  public environment = environment;
  public year = new Date().getFullYear();

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const user = this.authUser();
        if (user) {
          untracked(() => this.apiService.getUserTeams(user.id).subscribe(teams => this.teams.set(teams)));
        }
      });
      this.activatedRoute.queryParams.subscribe(params => {
        if (params?.message) {
          this.notificationService.emitSuccess(params.message);
        }
      });
      this.initSvgIcons();
    }
    // afterNextRender only runs in the browser.
    afterNextRender(() => {
      // if (!window.localStorage.getItem('cookiesAccepted')) {
      //   this.banner().open();
      // }

      this.initQuickSearch();
    });
  }

  // public acceptCookies() {
  //   this.banner().close();
  //   window.localStorage.setItem('cookiesAccepted', 'true');
  // }

  public notificationsLoaded(args: number) {
    this.unreadNotificationsDelta.update(count => count + args);
  }

  public clearSearch() {
    this.searchInput().nativeElement.value = '';
    this.searchTerm.set('');
  }

  private initSvgIcons() {
    const complogos = [discord, steam, twitch, battlenet, facebook, twitter, instagram, linkedin, tiktok, youtube, github];
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
    const input = fromEvent(this.searchInput().nativeElement, 'keyup')
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
          target: this.searchGroup().element.nativeElement
        };
        this.quickSearchDropDown().open(overlaySettings);
        this.searchService.quickSearch(val);
      }
    });
  }
}
