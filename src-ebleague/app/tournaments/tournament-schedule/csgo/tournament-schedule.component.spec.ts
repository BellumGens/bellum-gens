import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSGOTournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule, IgxAvatarModule } from 'igniteui-angular';
import { CSGOMapnamePipe } from 'src-bellumgens/app/pipes/mapname.pipe';
import { MapimagePipe } from 'src-bellumgens/app/pipes/mapimage.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CSGOTournamentScheduleComponent', () => {
  let component: CSGOTournamentScheduleComponent;
  let fixture: ComponentFixture<CSGOTournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSGOTournamentScheduleComponent, CSGOMapnamePipe, MapimagePipe ],
      imports: [
        HttpClientTestingModule,
        IgxCalendarModule,
        IgxAvatarModule
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
