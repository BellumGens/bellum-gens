import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TournamentCsgoComponent', () => {
  let component: TournamentCsgoComponent;
  let fixture: ComponentFixture<TournamentCsgoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxAvatarModule,
        IgxCardModule,
        IgxBadgeModule,
        IgxProgressBarModule,
        IgxListModule,
        IgxCalendarModule,
        IgxGridModule,
        IgxDividerModule,
        TournamentCsgoComponent,
        SortByPointsPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
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
