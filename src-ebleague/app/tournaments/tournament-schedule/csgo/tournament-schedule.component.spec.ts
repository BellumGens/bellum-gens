import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSGOTournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule } from 'igniteui-angular';

describe('CSGOTournamentScheduleComponent', () => {
  let component: CSGOTournamentScheduleComponent;
  let fixture: ComponentFixture<CSGOTournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSGOTournamentScheduleComponent ],
      imports: [
        IgxCalendarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSGOTournamentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
