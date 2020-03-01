import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarModule, IgxCardModule, IgxBadgeModule, IgxListModule, IgxProgressBarModule, IgxCalendarModule } from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SortByPointsPipe } from 'src-ebleague/app/pipes/sort-by-points.pipe';
import { CSGOTournamentScheduleComponent } from '../tournament-schedule/csgo/tournament-schedule.component';
import { MapnamePipe } from 'src-bellumgens/app/pipes/mapname.pipe';
import { MapimagePipe } from 'src-bellumgens/app/pipes/mapimage.pipe';

describe('TournamentCsgoComponent', () => {
  let component: TournamentCsgoComponent;
  let fixture: ComponentFixture<TournamentCsgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TournamentCsgoComponent,
        CSGOTournamentScheduleComponent,
        SortByPointsPipe,
        MapnamePipe,
        MapimagePipe
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxCardModule,
        IgxBadgeModule,
        IgxProgressBarModule,
        IgxListModule,
        IgxCalendarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCsgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
