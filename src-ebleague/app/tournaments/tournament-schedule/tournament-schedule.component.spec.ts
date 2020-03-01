import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentScheduleComponent } from './tournament-schedule.component';

describe('TournamentScheduleComponent', () => {
  let component: TournamentScheduleComponent;
  let fixture: ComponentFixture<TournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
