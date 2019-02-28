import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { IgxListModule, IgxIconModule, IgxSwitchModule, IgxInputGroupModule, IgxAvatarModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TEAM_PLACEHOLDER } from 'src/app/models/csgoteam';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxListModule,
        IgxIconModule,
        IgxSwitchModule,
        IgxInputGroupModule,
        IgxInputGroupModule,
        IgxAvatarModule
      ],
      declarations: [
        TeamPreferencesComponent,
        PlayerCountryPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPreferencesComponent);
    component = fixture.componentInstance;
    component.team = TEAM_PLACEHOLDER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
