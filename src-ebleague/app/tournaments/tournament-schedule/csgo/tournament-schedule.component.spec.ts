import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSGOTournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule, IgxAvatarModule } from 'igniteui-angular';
import { MapnamePipe } from 'src-bellumgens/app/pipes/mapname.pipe';
import { MapimagePipe } from 'src-bellumgens/app/pipes/mapimage.pipe';

describe('CSGOTournamentScheduleComponent', () => {
  let component: CSGOTournamentScheduleComponent;
  let fixture: ComponentFixture<CSGOTournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSGOTournamentScheduleComponent, MapnamePipe, MapimagePipe ],
      imports: [
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
