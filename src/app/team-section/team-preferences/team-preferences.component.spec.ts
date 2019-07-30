import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { IgxListModule, IgxIconModule, IgxSwitchModule, IgxInputGroupModule, IgxAvatarModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TEAM_PLACEHOLDER } from 'src/app/models/csgoteam';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExcludeMembersPipe } from 'src/app/pipes/exclude-members.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxListModule,
        IgxIconModule,
        IgxSwitchModule,
        IgxInputGroupModule,
        IgxInputGroupModule,
        IgxAvatarModule
      ],
      declarations: [
        TeamPreferencesComponent,
        PlayerCountryPipe,
        ExcludeMembersPipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            }
          }
        }
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
