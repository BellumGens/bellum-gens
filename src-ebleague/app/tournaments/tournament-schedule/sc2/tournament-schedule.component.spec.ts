import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SC2TournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule } from 'igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SC2TournamentScheduleComponent', () => {
  let component: SC2TournamentScheduleComponent;
  let fixture: ComponentFixture<SC2TournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SC2TournamentScheduleComponent ],
      imports: [
        HttpClientTestingModule,
        IgxCalendarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SC2TournamentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
