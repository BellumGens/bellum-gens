import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentSc2Component } from './tournament-sc2.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  IgxAvatarModule,
  IgxCardModule,
  IgxBadgeModule,
  IgxListModule,
  IgxProgressBarModule,
  IgxGridModule,
  IgxCalendarModule,
  IgxDividerModule
} from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SortByPointsPipe } from 'projects/ebleague/src/app/pipes/sort-by-points.pipe';

describe('TournamentSc2Component', () => {
  let component: TournamentSc2Component;
  let fixture: ComponentFixture<TournamentSc2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxAvatarModule,
        IgxCardModule,
        IgxBadgeModule,
        IgxCalendarModule,
        IgxProgressBarModule,
        IgxListModule,
        IgxGridModule,
        IgxDividerModule,
        TournamentSc2Component,
        SortByPointsPipe
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
