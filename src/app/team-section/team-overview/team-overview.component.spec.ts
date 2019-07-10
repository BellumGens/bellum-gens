import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOverviewComponent } from './team-overview.component';
import { IgxAvatarModule,
  IgxIconModule,
  IgxTabsModule,
  IgxCardModule,
  IgxDragDropModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxRadioModule,
  IgxToggleModule,
  IgxDialogModule,
  IgxSwitchModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxCheckboxModule,
  IgxRippleModule,
  IgxSelectModule,
  IgxBadgeModule} from 'igniteui-angular';
import { TeamDetailsComponent } from '../team-details/team-details.component';
import { TeamStrategiesComponent } from '../team-strategies/team-strategies.component';
import { TeamApplicationComponent } from '../team-application/team-application.component';
import { TeamPreferencesComponent } from '../team-preferences/team-preferences.component';
import { AvailabilityComponent } from 'src/app/availability/availability.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { MapPoolComponent } from 'src/app/map-pool/map-pool.component';
import { FormsModule } from '@angular/forms';
import { SideStratsPipe } from 'src/app/pipes/sidestrats.pipe';
import { SafeVideoLinkPipe } from 'src/app/pipes/safe-video-link.pipe';
import { MapnamePipe } from 'src/app/pipes/mapname.pipe';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { MapimagePipe } from 'src/app/pipes/mapimage.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ExcludeMembersPipe } from 'src/app/pipes/exclude-members.pipe';
import { ActiveDutyMapsPipe } from 'src/app/pipes/active-duty-maps.pipe';
import { IsVideoPipe } from 'src/app/pipes/is-video.pipe';
import { TruncateTextPipe } from 'src/app/pipes/truncate-text.pipe';

describe('TeamOverviewComponent', () => {
  let component: TeamOverviewComponent;
  let fixture: ComponentFixture<TeamOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxIconModule,
        IgxTabsModule,
        IgxCardModule,
        IgxDragDropModule,
        IgxListModule,
        IgxInputGroupModule,
        IgxRadioModule,
        IgxToggleModule,
        IgxSelectModule,
        IgxDialogModule,
        IgxSwitchModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxCheckboxModule,
        IgxRippleModule,
        IgxBadgeModule
      ],
      declarations: [
        TeamOverviewComponent,
        TeamDetailsComponent,
        TeamStrategiesComponent,
        TeamApplicationComponent,
        TeamPreferencesComponent,
        AvailabilityComponent,
        ConfirmComponent,
        MapPoolComponent,
        PlayerCountryPipe,
        SideStratsPipe,
        SafeVideoLinkPipe,
        MapnamePipe,
        WeekdayPipe,
        MapimagePipe,
        ExcludeMembersPipe,
        ActiveDutyMapsPipe,
        IsVideoPipe,
        TruncateTextPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
