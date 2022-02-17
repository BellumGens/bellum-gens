import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  IgxAvatarModule,
  IgxCardModule,
  IgxBadgeModule,
  IgxListModule,
  IgxProgressBarModule,
  IgxCalendarModule,
  IgxGridModule,
  IgxDividerModule
} from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SortByPointsPipe } from 'projects/ebleague/src/app/pipes/sort-by-points.pipe';
import { BellumGensModule } from 'projects/common/src/lib/public_api';

describe('TournamentCsgoComponent', () => {
  let component: TournamentCsgoComponent;
  let fixture: ComponentFixture<TournamentCsgoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TournamentCsgoComponent,
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
        IgxCalendarModule,
        IgxGridModule,
        IgxDividerModule,
        BellumGensModule
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
