import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { IgxNavigationDrawerModule,
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxIconModule,
  IgxDropDownModule,
  IgxInputGroupModule,
  IgxToggleModule,
  IgxBadgeModule,
  IgxBannerModule,
  IgxButtonModule,
  IgxSnackbarModule,
  IgxAvatarModule,
  IgxCardModule,
  IgxListModule,
  IgxDialogModule,
  IgxProgressBarModule,
  IgxButtonGroupModule,
  IgxSliderModule,
  IgxRadioModule,
  IgxTabsModule,
  IgxSwitchModule,
  IgxDividerModule,
  IgxSelectModule} from 'igniteui-angular';
import { SuccessErrorComponent } from './success-error/success-error.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TeamNavComponent } from './team-section/team-nav/team-nav.component';
import { LoginComponent } from './login/login.component';
import { QuickSearchComponent } from './search/quick-search/quick-search.component';
import { SearchComponent } from './search/search/search.component';
import { TeamNotificationsComponent } from './team-section/team-notifications/team-notifications.component';
import { PlayerNotificationsComponent } from './player-section/notifications/notifications.component';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from './confirm/confirm.component';
import { GroupsFilterPipe } from './pipes/groups-filter.pipe';
import { ReduceQuickSearchResultPipe } from './pipes/reduce-quick-search-result.pipe';
import { PlayerSearchComponent } from './search/player-search/player-search.component';
import { TeamSearchComponent } from './search/team-search/team-search.component';
import { DisabledNotificationsPipe } from './pipes/disabled-notifications.pipe';
import { SortNotificationsPipe } from './pipes/sort-notifications.pipe';
import { SortApplicationsPipe } from './pipes/sort-applications.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from './player-section/user-preferences/user-preferences.component';
import { NotificationStatePipe } from './pipes/notification-state.pipe';
import { PlayerCountryPipe } from './pipes/player-country.pipe';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { TeamNewComponent } from './team-section/team-new/team-new.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxNavigationDrawerModule,
        IgxNavbarModule,
        IgxLayoutModule,
        IgxIconModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxInputGroupModule,
        IgxBadgeModule,
        IgxBannerModule,
        IgxButtonModule,
        IgxNavbarModule,
        IgxSnackbarModule,
        IgxAvatarModule,
        IgxCardModule,
        IgxListModule,
        IgxDialogModule,
        IgxRippleModule,
        IgxProgressBarModule,
        IgxButtonGroupModule,
        IgxSliderModule,
        IgxRadioModule,
        IgxTabsModule,
        IgxDividerModule,
        IgxSelectModule,
        IgxSwitchModule
      ],
      declarations: [
        AppComponent,
        SuccessErrorComponent,
        NotificationsComponent,
        TeamNavComponent,
        LoginComponent,
        LoginDialogComponent,
        QuickSearchComponent,
        SearchComponent,
        TeamNotificationsComponent,
        PlayerNotificationsComponent,
        ConfirmComponent,
        PlayerSearchComponent,
        TeamSearchComponent,
        GroupsFilterPipe,
        ReduceQuickSearchResultPipe,
        DisabledNotificationsPipe,
        SortApplicationsPipe,
        SortNotificationsPipe,
        UserPreferencesComponent,
        NotificationStatePipe,
        PlayerCountryPipe,
        TeamNewComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
