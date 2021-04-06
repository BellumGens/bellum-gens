import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
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
  IgxSelectModule} from '@infragistics/igniteui-angular';
import { NotificationsComponent } from './notifications/notifications.component';
import { TeamNavComponent } from './team-section/team-nav/team-nav.component';
import { QuickSearchComponent } from './search/quick-search/quick-search.component';
import { SearchComponent } from './search/search/search.component';
import { FormsModule } from '@angular/forms';
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
import { NotificationStatePipe } from './pipes/notification-state.pipe';
import { TeamNewComponent } from './team-section/team-new/team-new.component';
import { BellumGensModule, LanguagesModule, LoginModule, SuccessErrorModule } from 'src-common/lib/public_api';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
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
        IgxSwitchModule,
        BellumGensModule,
        LanguagesModule,
        LoginModule,
        SuccessErrorModule
      ],
      declarations: [
        AppComponent,
        NotificationsComponent,
        TeamNavComponent,
        QuickSearchComponent,
        SearchComponent,
        PlayerSearchComponent,
        TeamSearchComponent,
        GroupsFilterPipe,
        ReduceQuickSearchResultPipe,
        DisabledNotificationsPipe,
        SortApplicationsPipe,
        SortNotificationsPipe,
        NotificationStatePipe,
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
