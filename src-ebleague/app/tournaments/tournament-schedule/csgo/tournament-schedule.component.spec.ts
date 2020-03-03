import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSGOTournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule, IgxAvatarModule, IgxProgressBarModule } from 'igniteui-angular';
import { CSGOMapnamePipe } from 'src-bellumgens/app/pipes/mapname.pipe';
import { MapimagePipe } from 'src-bellumgens/app/pipes/mapimage.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CSGOTournamentScheduleComponent', () => {
  let component: CSGOTournamentScheduleComponent;
  let fixture: ComponentFixture<CSGOTournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSGOTournamentScheduleComponent, CSGOMapnamePipe, MapimagePipe ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        IgxCalendarModule,
        IgxAvatarModule,
        IgxProgressBarModule
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
