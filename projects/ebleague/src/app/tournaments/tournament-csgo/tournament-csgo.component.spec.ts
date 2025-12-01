import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxCardModule } from '@infragistics/igniteui-angular/card';
import { IgxBadgeModule } from '@infragistics/igniteui-angular/badge';
import { IgxListModule } from '@infragistics/igniteui-angular/list';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { IgxCalendarModule } from '@infragistics/igniteui-angular/calendar';
import { IgxGridModule } from '@infragistics/igniteui-angular/grids/grid';
import { IgxDividerModule } from '@infragistics/igniteui-angular/directives';
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
