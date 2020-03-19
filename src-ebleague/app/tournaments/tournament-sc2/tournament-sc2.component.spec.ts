import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSc2Component } from './tournament-sc2.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarModule, IgxCardModule, IgxBadgeModule, IgxListModule, IgxProgressBarModule, IgxGridModule } from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SortByPointsPipe } from 'src-ebleague/app/pipes/sort-by-points.pipe';
import { SC2TournamentScheduleComponent } from '../tournament-schedule/sc2/tournament-schedule.component';

describe('TournamentSc2Component', () => {
  let component: TournamentSc2Component;
  let fixture: ComponentFixture<TournamentSc2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TournamentSc2Component,
        SC2TournamentScheduleComponent,
        SortByPointsPipe
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
        IgxGridModule
      ]
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
