import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStrategiesComponent } from './team-strategies.component';
import { IgxIconModule,
  IgxCardModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxRadioModule,
  IgxDialogModule,
  IgxToggleModule,
  IgxCheckboxModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxSelectModule,
  IgxAvatarModule,
  IgxBadgeModule,
  IgxSwitchModule} from 'igniteui-angular';
import { MapPoolComponent } from 'src/app/map-pool/map-pool.component';
import { SafeVideoLinkPipe } from 'src/app/pipes/safe-video-link.pipe';
import { FormsModule } from '@angular/forms';
import { MapnamePipe } from 'src/app/pipes/mapname.pipe';
import { SideStratsPipe } from 'src/app/pipes/sidestrats.pipe';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { MapimagePipe } from 'src/app/pipes/mapimage.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AvailabilityComponent } from 'src/app/availability/availability.component';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { ActiveDutyMapsPipe } from 'src/app/pipes/active-duty-maps.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TruncateTextPipe } from 'src/app/pipes/truncate-text.pipe';
import { IsVideoPipe } from 'src/app/pipes/is-video.pipe';

describe('TeamStrategiesComponent', () => {
  let component: TeamStrategiesComponent;
  let fixture: ComponentFixture<TeamStrategiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        IgxIconModule,
        IgxAvatarModule,
        IgxCardModule,
        IgxListModule,
        IgxInputGroupModule,
        IgxRadioModule,
        IgxToggleModule,
        IgxSelectModule,
        IgxDialogModule,
        IgxCheckboxModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxBadgeModule,
        IgxSwitchModule
      ],
      declarations: [
        TeamStrategiesComponent,
        MapPoolComponent,
        ConfirmComponent,
        AvailabilityComponent,
        SafeVideoLinkPipe,
        MapnamePipe,
        SideStratsPipe,
        MapimagePipe,
        WeekdayPipe,
        ActiveDutyMapsPipe,
        TruncateTextPipe,
        IsVideoPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
