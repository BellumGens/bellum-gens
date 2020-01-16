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
import { TeamNavComponent } from '../../src-bellumgens/app/team-section/team-nav/team-nav.component';
import { LoginComponent } from '../../src-bellumgens/app/login/login.component';
import { QuickSearchComponent } from '../../src-bellumgens/app/search/quick-search/quick-search.component';
import { FormsModule } from '@angular/forms';
import { GroupsFilterPipe } from '../../src-bellumgens/app/pipes/groups-filter.pipe';
import { ReduceQuickSearchResultPipe } from '../../src-bellumgens/app/pipes/reduce-quick-search-result.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from '../../src-bellumgens/app/player-section/user-preferences/user-preferences.component';
import { PlayerCountryPipe } from '../../src-bellumgens/app/pipes/player-country.pipe';
import { LoginDialogComponent } from '../../src-bellumgens/app/login/login-dialog/login-dialog.component';
import { TeamNewComponent } from '../../src-bellumgens/app/team-section/team-new/team-new.component';
import { BellumGensModule } from 'src-common/components/components.module';

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
        IgxSwitchModule,
        BellumGensModule
      ],
      declarations: [
        AppComponent,
        SuccessErrorComponent,
        TeamNavComponent,
        LoginComponent,
        LoginDialogComponent,
        QuickSearchComponent,
        GroupsFilterPipe,
        ReduceQuickSearchResultPipe,
        UserPreferencesComponent,
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
