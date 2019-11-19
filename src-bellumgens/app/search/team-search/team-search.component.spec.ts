import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';
import { FormsModule } from '@angular/forms';
import { IgxRadioModule,
  IgxSliderModule,
  IgxDialogModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxDropDownModule,
  IgxToggleModule,
  IgxTabsModule,
  IgxInputGroupModule,
  IgxSwitchModule,
  IgxProgressBarModule,
  IgxDividerModule,
  IgxButtonModule} from 'igniteui-angular';
import { LoginComponent } from 'src-bellumgens/app/login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from 'src-bellumgens/app/player-section/user-preferences/user-preferences.component';
import { ConfirmComponent } from 'src-bellumgens/app/confirm/confirm.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeamSearchComponent', () => {
  let component: TeamSearchComponent;
  let fixture: ComponentFixture<TeamSearchComponent>;

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
        IgxRippleModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxButtonModule
      ],
      declarations: [
        TeamSearchComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
