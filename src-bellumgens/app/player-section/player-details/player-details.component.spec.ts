import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerDetailsComponent } from './player-details.component';
import { IgxProgressBarModule,
  IgxCardModule,
  IgxAvatarModule,
  IgxToggleModule,
  IgxDropDownModule,
  IgxIconModule,
  IgxDialogModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxCheckboxModule,
  IgxListModule,
  IgxSelectModule,
  IgxTabsModule,
  IgxSwitchModule,
  IgxInputGroupModule,
  IgxDividerModule,
  IgxButtonModule} from '@infragistics/igniteui-angular';
import { SteamCustomUrlPipe } from 'src-bellumgens/app/pipes/steam-custom-url.pipe';
import { PlayerCountryPipe } from 'src-bellumgens/app/pipes/player-country.pipe';
import { AvailabilityComponent } from 'src-bellumgens/app/availability/availability.component';
import { TopWeaponAltPipe } from 'src-bellumgens/app/pipes/top-weapon-alt.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { WeekdayPipe } from 'src-bellumgens/app/pipes/weekday.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SortWeaponsPipe } from 'src-bellumgens/app/pipes/sort-weapons.pipe';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActiveDutyMapsPipe } from 'src-bellumgens/app/pipes/active-duty-maps.pipe';
import { AppShellComponent } from 'src-bellumgens/app/app-shell/app-shell.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BellumGensModule } from 'src-common/components/components.module';
import { MapPoolComponent } from '../map-pool/map-pool.component';

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerDetailsComponent,
        AvailabilityComponent,
        AppShellComponent,
        MapPoolComponent,
        SteamCustomUrlPipe,
        PlayerCountryPipe,
        TopWeaponAltPipe,
        WeekdayPipe,
        SortWeaponsPipe,
        ActiveDutyMapsPipe
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        FormsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxIconModule,
        IgxDialogModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxCheckboxModule,
        IgxSelectModule,
        IgxListModule,
        IgxTabsModule,
        IgxSwitchModule,
        IgxDividerModule,
        IgxButtonModule,
        IgxInputGroupModule,
        BellumGensModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
