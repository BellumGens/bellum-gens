import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSc2Component } from './tournament-sc2.component';

describe('TournamentSc2Component', () => {
  let component: TournamentSc2Component;
  let fixture: ComponentFixture<TournamentSc2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentSc2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
