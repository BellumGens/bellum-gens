import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStrategiesComponent } from './team-strategies.component';
import { IgxExpansionPanelModule,
  IgxIconModule,
  IgxCardModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxRadioModule,
  IgxDialogModule,
  IgxToggleModule,
  IgxCheckboxModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxSelectModule} from 'igniteui-angular';
import { MapPoolComponent } from 'src/app/map-pool/map-pool.component';
import { SafeVideoLinkPipe } from 'src/app/pipes/safe-video-link.pipe';
import { FormsModule } from '@angular/forms';
import { MapnamePipe } from 'src/app/pipes/mapname.pipe';
import { SideStratsPipe } from 'src/app/pipes/sidestrats.pipe';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { MapimagePipe } from 'src/app/pipes/mapimage.pipe';
import { OrdermapsPipe } from 'src/app/pipes/ordermaps.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AvailabilityComponent } from 'src/app/availability/availability.component';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { ActiveDutyMapsPipe } from 'src/app/pipes/active-duty-maps.pipe';

describe('TeamStrategiesComponent', () => {
  let component: TeamStrategiesComponent;
  let fixture: ComponentFixture<TeamStrategiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxExpansionPanelModule,
        IgxIconModule,
        IgxCardModule,
        IgxListModule,
        IgxInputGroupModule,
        IgxRadioModule,
        IgxToggleModule,
        IgxSelectModule,
        IgxDialogModule,
        IgxCheckboxModule,
        IgxChipsModule,
        IgxTimePickerModule
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
        OrdermapsPipe,
        WeekdayPipe,
        ActiveDutyMapsPipe
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
