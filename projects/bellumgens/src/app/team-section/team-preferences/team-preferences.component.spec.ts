import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TEAM_PLACEHOLDER } from '../../../../../common/src/public_api';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        TeamPreferencesComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            },
            data: new Observable()
          }
        }
      ]
    }).compileComponents();
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
