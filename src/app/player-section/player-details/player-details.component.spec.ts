import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
  IgxButtonModule} from 'igniteui-angular';
import { SteamCustomUrlPipe } from 'src/app/pipes/steam-custom-url.pipe';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';
import { AvailabilityComponent } from 'src/app/availability/availability.component';
import { TopWeaponAltPipe } from 'src/app/pipes/top-weapon-alt.pipe';
import { MapPoolComponent } from 'src/app/map-pool/map-pool.component';
import { RouterTestingModule } from '@angular/router/testing';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { MapnamePipe } from 'src/app/pipes/mapname.pipe';
import { MapimagePipe } from 'src/app/pipes/mapimage.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SortWeaponsPipe } from 'src/app/pipes/sort-weapons.pipe';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from '../user-preferences/user-preferences.component';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { ActiveDutyMapsPipe } from 'src/app/pipes/active-duty-maps.pipe';
import { AppShellComponent } from 'src/app/app-shell/app-shell.component';
import { LoginDialogComponent } from 'src/app/login/login-dialog/login-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerDetailsComponent,
        LoginDialogComponent,
        AvailabilityComponent,
        AppShellComponent,
        MapPoolComponent,
        SteamCustomUrlPipe,
        PlayerCountryPipe,
        TopWeaponAltPipe,
        WeekdayPipe,
        MapnamePipe,
        MapimagePipe,
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
        IgxInputGroupModule
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
