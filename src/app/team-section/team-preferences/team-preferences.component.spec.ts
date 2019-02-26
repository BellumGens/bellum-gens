import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
