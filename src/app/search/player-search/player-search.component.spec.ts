import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxRadioModule,
  IgxSliderModule,
  IgxDialogModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxToggleModule,
  IgxDropDownModule,
  IgxTabsModule,
  IgxSwitchModule,
  IgxInputGroupModule,
  IgxProgressBarModule} from 'igniteui-angular';
import { LoginComponent } from 'src/app/login/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from 'src/app/player-section/user-preferences/user-preferences.component';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxRadioModule,
        IgxSliderModule,
        IgxDialogModule,
        IgxRippleModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxTabsModule,
        IgxSwitchModule,
        IgxInputGroupModule,
        IgxProgressBarModule
      ],
      declarations: [
        PlayerSearchComponent,
        LoginComponent,
        UserPreferencesComponent,
        ConfirmComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
