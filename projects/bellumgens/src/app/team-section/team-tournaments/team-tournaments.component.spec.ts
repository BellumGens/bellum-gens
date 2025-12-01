import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamTournamentsComponent } from './team-tournaments.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamTournamentsComponent', () => {
  let component: TeamTournamentsComponent;
  let fixture: ComponentFixture<TeamTournamentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TeamTournamentsComponent
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
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have emptyGuid initialized', () => {
    expect(component.emptyGuid).toBeDefined();
    expect(component.emptyGuid).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('should have emptyGuid constant', () => {
    expect(component.emptyGuid).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('should initialize emptyGuid property', () => {
    expect(component.emptyGuid).toBeDefined();
    expect(typeof component.emptyGuid).toBe('string');
  });
});
