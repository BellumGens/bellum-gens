import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { PositionSettings,
  HorizontalAlignment,
  OverlaySettings,
  IgxDropDownComponent,
  IgxInputGroupComponent,
  AutoPositionStrategy,
  IgxSnackbarComponent} from 'igniteui-angular';
import { LoginService } from './services/login.service';
import { ApplicationUser } from './models/applicationuser';
import { BellumgensApiService } from './services/bellumgens-api.service';
import { SearchResult } from './models/searchresult';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';
import { BaseComponent } from './base/base.component';
import { GlobalOverlaySettings } from './models/misc';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit {
  public title = 'Bellum Gens';
  public authUser: ApplicationUser;
  public searchResult: SearchResult;
  public unreadNotifications = 0;

  public overlaySettings = GlobalOverlaySettings;

  @ViewChild('quickSearch', { static: true }) public quickSearchDropDown: IgxDropDownComponent;
  @ViewChild('searchGroup', { static: true }) public searchGroup: IgxInputGroupComponent;
  @ViewChild('searchInput', { static: true }) public searchInput: ElementRef;
  @ViewChild(IgxSnackbarComponent, { static: true }) public snackbar: IgxSnackbarComponent;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private commService: CommunicationService) {
    super();
    this.subs.push(
      this.commService.headerTitle.subscribe(title => this.title = title)
    );
  }

  public ngOnInit(): void {
    this.subs.push(this.authManager.applicationUser.subscribe(data => {
      this.authUser = data;
      this.unreadNotifications += this.unreadPipe.transform(data.notifications);
    }));
    if (!window.localStorage.getItem('cookiesAccepted')) {
      this.snackbar.isVisible = true;
    }
    this.initQuickSearch();
  }

  public acceptCookies() {
    this.snackbar.hide();
    window.localStorage.setItem('cookiesAccepted', 'true');
  }

  private initQuickSearch() {
    const input = fromEvent(this.searchInput.nativeElement, 'keyup')
                    .pipe(map<Event, string>(e => (<HTMLInputElement>e.currentTarget).value));
    const debouncedInput = input.pipe(debounceTime(300));
    this.subs.push(debouncedInput.subscribe(val => {
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
    }));
  }

  public notificationsLoaded(args: number) {
    this.unreadNotifications += args;
  }
}
