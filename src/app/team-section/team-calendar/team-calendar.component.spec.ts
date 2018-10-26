import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCalendarComponent } from './team-calendar.component';

describe('TeamCalendarComponent', () => {
  let component: TeamCalendarComponent;
  let fixture: ComponentFixture<TeamCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
