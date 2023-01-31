import { Component, OnInit, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  PositionSettings,
  HorizontalAlignment,
  OverlaySettings,
  IgxDropDownComponent,
  IgxInputGroupComponent,
  AutoPositionStrategy,
  IgxBannerComponent
} from '@infragistics/igniteui-angular';

import {
  LoginService,
  ApplicationUser,
  BellumgensApiService,
  SearchResult,
  GLOBAL_OVERLAY_SETTINGS,
  CSGOTeam,
  ApiSearchService
} from '../../../common/src/public_api';

import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { environment } from '../../../common/src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
  public title = 'Bellum Gens';
  public year = new Date().getFullYear();

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private authManager: LoginService,
              private apiService: BellumgensApiService,
              private searchService: ApiSearchService) {
    this.authManager.applicationUser.subscribe(user => {
        this.authUser = user;
        if (user) {
          this.authManager.userNotifications.subscribe(data => this.unreadNotifications += this.unreadPipe.transform(data));
          this.apiService.getUserTeams(user.id).subscribe(teams => this.teams = teams);
        }
      }
    );
    this.resize();
  }

  @HostListener('window:resize')
  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.title = window.matchMedia('(min-width: 768px)').matches ? 'Bellum Gens' : '';
    }
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && !window.localStorage.getItem('cookiesAccepted')) {
      this.banner.open();
    }
    this.initQuickSearch();
  }

  public acceptCookies() {
    this.banner.close();
    window.localStorage.setItem('cookiesAccepted', 'true');
  }

  public notificationsLoaded(args: number) {
    this.unreadNotifications += args;
  }

  private initQuickSearch() {
    const input = fromEvent(this.searchInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (e.currentTarget as HTMLInputElement).value));
    const debouncedInput = input.pipe(debounceTime(300));
    debouncedInput.subscribe(val => {
      if (val.length) {
        const positionSettings: PositionSettings = {
          horizontalDirection: HorizontalAlignment.Left,
          horizontalStartPoint: HorizontalAlignment.Right,
          target: this.searchGroup.element.nativeElement
        };
        const overlaySettings: OverlaySettings = {
          positionStrategy: new AutoPositionStrategy(positionSettings),
          modal: false
        };
        this.quickSearchDropDown.open(overlaySettings);
        this.searchService.quickSearch(val);
      }
    });
  }
}
