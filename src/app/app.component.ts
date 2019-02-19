import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { PositionSettings,
  HorizontalAlignment,
  OverlaySettings,
  ConnectedPositioningStrategy,
  IgxDropDownComponent,
  IgxInputGroupComponent} from 'igniteui-angular';
import { LoginService } from './services/login.service';
import { ApplicationUser } from './models/applicationuser';
import { BellumgensApiService } from './services/bellumgens-api.service';
import { SearchResult } from './models/searchresult';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UnreadNotificationsPipe } from './pipes/unread-notifications.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;
  public authUser: ApplicationUser;
  public searchResult: SearchResult;
  public unreadNotifications = 0;

  public positionSettings: PositionSettings = {
    horizontalDirection: HorizontalAlignment.Left,
    horizontalStartPoint: HorizontalAlignment.Right
  };

  public overlaySettings: OverlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy(this.positionSettings)
  };

  @ViewChild('quickSearch') public quickSearchDropDown: IgxDropDownComponent;
  @ViewChild('searchGroup') public searchGroup: IgxInputGroupComponent;
  @ViewChild('searchInput') public searchInput: ElementRef;

  private unreadPipe = new UnreadNotificationsPipe();

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService) {
  }

  public ngOnInit(): void {
    this.authManager.applicationUser.subscribe(data => {
      this.authUser = data;
      this.unreadNotifications += this.unreadPipe.transform(data.Notifications);
    });
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
          positionStrategy: new ConnectedPositioningStrategy(positionSettings),
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
}
