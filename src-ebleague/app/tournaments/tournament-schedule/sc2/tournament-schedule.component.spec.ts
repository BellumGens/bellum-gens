import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SC2TournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule } from 'igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Sc2MapNamePipe } from 'src-ebleague/app/pipes/sc2-map-name.pipe';

describe('SC2TournamentScheduleComponent', () => {
  let component: SC2TournamentScheduleComponent;
  let fixture: ComponentFixture<SC2TournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SC2TournamentScheduleComponent, Sc2MapNamePipe ],
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
