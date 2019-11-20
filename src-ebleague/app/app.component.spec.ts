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
import { SuccessErrorComponent } from '../../src-bellumgens/app/success-error/success-error.component';
import { NotificationsComponent } from '../../src-bellumgens/app/notifications/notifications.component';
import { TeamNavComponent } from '../../src-bellumgens/app/team-section/team-nav/team-nav.component';
import { LoginComponent } from '../../src-bellumgens/app/login/login.component';
import { QuickSearchComponent } from '../../src-bellumgens/app/search/quick-search/quick-search.component';
import { SearchComponent } from '../../src-bellumgens/app/search/search/search.component';
import { TeamNotificationsComponent } from '../../src-bellumgens/app/team-section/team-notifications/team-notifications.component';
import { PlayerNotificationsComponent } from '../../src-bellumgens/app/player-section/notifications/notifications.component';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from '../../src-bellumgens/app/confirm/confirm.component';
import { GroupsFilterPipe } from '../../src-bellumgens/app/pipes/groups-filter.pipe';
import { ReduceQuickSearchResultPipe } from '../../src-bellumgens/app/pipes/reduce-quick-search-result.pipe';
import { PlayerSearchComponent } from '../../src-bellumgens/app/search/player-search/player-search.component';
import { TeamSearchComponent } from '../../src-bellumgens/app/search/team-search/team-search.component';
import { DisabledNotificationsPipe } from '../../src-bellumgens/app/pipes/disabled-notifications.pipe';
import { SortNotificationsPipe } from '../../src-bellumgens/app/pipes/sort-notifications.pipe';
import { SortApplicationsPipe } from '../../src-bellumgens/app/pipes/sort-applications.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from '../../src-bellumgens/app/player-section/user-preferences/user-preferences.component';
import { NotificationStatePipe } from '../../src-bellumgens/app/pipes/notification-state.pipe';
import { PlayerCountryPipe } from '../../src-bellumgens/app/pipes/player-country.pipe';
import { LoginDialogComponent } from '../../src-bellumgens/app/login/login-dialog/login-dialog.component';
import { TeamNewComponent } from '../../src-bellumgens/app/team-section/team-new/team-new.component';

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
