import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { PositionSettings,
  HorizontalAlignment,
  OverlaySettings,
  IgxDropDownComponent,
  IgxInputGroupComponent,
  AutoPositionStrategy,
  IgxBannerComponent} from '@infragistics/igniteui-angular';
import { LoginService } from '../../src-common/services/login.service';
import { ApplicationUser } from '../../src-common/models/applicationuser';
import { BellumgensApiService } from '../../src-common/services/bellumgens-api.service';
import { SearchResult } from '../../src-common/models/searchresult';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { GLOBAL_OVERLAY_SETTINGS } from '../../src-common/models/misc';
import { environment } from '../../src-common/environments/environment';
import { CSGOTeam } from '../../src-common/models/csgoteam';
import { ApiSearchService } from '../../src-common/services/bellumgens-api.search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(private authManager: LoginService,
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
  }

  public ngOnInit(): void {
    if (!window.localStorage.getItem('cookiesAccepted')) {
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
