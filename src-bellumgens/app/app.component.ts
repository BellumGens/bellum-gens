import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, HostListener, Inject } from '@angular/core';

import { PositionSettings,
  HorizontalAlignment,
  OverlaySettings,
  IgxDropDownComponent,
  IgxInputGroupComponent,
  AutoPositionStrategy,
  IgxBannerComponent} from 'igniteui-angular';
import { LoginService } from '../../src-common/services/login.service';
import { ApplicationUser } from '../../src-common/models/applicationuser';
import { BellumgensApiService } from '../../src-common/services/bellumgens-api.service';
import { SearchResult } from '../../src-common/models/searchresult';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { GlobalOverlaySettings } from '../../src-common/models/misc';
import { CommunicationService } from '../../src-common/services/communication.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public authUser: ApplicationUser;
  public searchResult: SearchResult;
  public unreadNotifications = 0;
  private _headerTitle = 'Bellum Gens';
  private _headerTitleShort = '';
  public title: string;

  public overlaySettings = GlobalOverlaySettings;

  @ViewChild('quickSearch', { static: true }) public quickSearchDropDown: IgxDropDownComponent;
  @ViewChild('myTeam', { static: true }) public teamDropDown: IgxDropDownComponent;
  @ViewChild('searchGroup', { static: true }) public searchGroup: IgxInputGroupComponent;
  @ViewChild('searchInput', { static: true }) public searchInput: ElementRef;
  @ViewChild('cookiesBanner', { static: true }) public banner: IgxBannerComponent;

  private unreadPipe = new UnreadNotificationsPipe();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
              private authManager: LoginService,
              private apiService: BellumgensApiService,
              private commService: CommunicationService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.commService.openTeams.subscribe(_ => this.teamDropDown.open());
    if (this.isBrowser) {
      this.title = window.matchMedia('(min-width: 768px)').matches ? this._headerTitle : this._headerTitleShort;
    } else {
      this.title = this._headerTitle;
    }
    this.authManager.applicationUser.subscribe(data => {
      this.authUser = data;
      this.unreadNotifications += this.unreadPipe.transform(data.notifications);
    });
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
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

  private initQuickSearch() {
    const input = fromEvent(this.searchInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (<HTMLInputElement>e.currentTarget).value));
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
        this.apiService.quickSearch(val);
      }
    });
  }

  public notificationsLoaded(args: number) {
    this.unreadNotifications += args;
  }

  @HostListener('window:resize')
  public resize() {
    this.title = window.matchMedia('(min-width: 768px)').matches ? this._headerTitle : this._headerTitleShort;
  }
}
