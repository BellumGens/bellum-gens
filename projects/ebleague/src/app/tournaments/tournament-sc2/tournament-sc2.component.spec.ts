import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentSc2Component } from './tournament-sc2.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxCardModule } from '@infragistics/igniteui-angular/card';
import { IgxBadgeModule } from '@infragistics/igniteui-angular/badge';
import { IgxListModule } from '@infragistics/igniteui-angular/list';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { IgxGridModule } from '@infragistics/igniteui-angular/grids/grid';
import { IgxCalendarModule } from '@infragistics/igniteui-angular/calendar';
import { IgxDividerModule } from '@infragistics/igniteui-angular/directives';
import { RouterTestingModule } from '@angular/router/testing';
import { SortByPointsPipe } from 'projects/ebleague/src/app/pipes/sort-by-points.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TournamentSc2Component', () => {
  let component: TournamentSc2Component;
  let fixture: ComponentFixture<TournamentSc2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
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
        SortByPointsPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
