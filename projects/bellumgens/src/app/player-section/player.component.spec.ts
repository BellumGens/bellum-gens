import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

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
import { SteamCustomUrlPipe } from 'projects/bellumgens/src/app/pipes/steam-custom-url.pipe';
import { TopWeaponAltPipe } from 'projects/bellumgens/src/app/pipes/top-weapon-alt.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SortWeaponsPipe } from 'projects/bellumgens/src/app/pipes/sort-weapons.pipe';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AvailabilityModule, BellumGensModule, ConfirmModule, LoadingModule } from 'projects/common/src/public_api';
import { MapPoolComponent } from './map-pool/map-pool.component';
import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        FormsModule,
        ServiceWorkerModule.register('', { enabled: false }),
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
        BellumGensModule,
        AvailabilityModule,
        ConfirmModule,
        LoadingModule,
        PlayerComponent,
        MapPoolComponent,
        SteamCustomUrlPipe,
        TopWeaponAltPipe,
        SortWeaponsPipe
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
