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
  IgxCheckboxModule} from 'igniteui-angular';
import { SteamCustomUrlPipe } from 'src/app/pipes/steam-custom-url.pipe';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';
import { LoginComponent } from 'src/app/login/login.component';
import { AvailabilityComponent } from 'src/app/availability/availability.component';
import { TopWeaponAltPipe } from 'src/app/pipes/top-weapon-alt.pipe';
import { MapPoolComponent } from 'src/app/map-pool/map-pool.component';
import { RouterTestingModule } from '@angular/router/testing';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { MapnamePipe } from 'src/app/pipes/mapname.pipe';
import { MapimagePipe } from 'src/app/pipes/mapimage.pipe';
import { OrdermapsPipe } from 'src/app/pipes/ordermaps.pipe';

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsComponent;
  let fixture: ComponentFixture<PlayerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerDetailsComponent,
        LoginComponent,
        AvailabilityComponent,
        MapPoolComponent,
        SteamCustomUrlPipe,
        PlayerCountryPipe,
        TopWeaponAltPipe,
        WeekdayPipe,
        MapnamePipe,
        MapimagePipe,
        OrdermapsPipe
      ],
      imports: [
        RouterTestingModule,
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxIconModule,
        IgxDialogModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxCheckboxModule
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
