import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxDividerDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { RouterTestingModule } from '@angular/router/testing';
import { SortByPointsPipe } from 'projects/ebleague/src/app/pipes/sort-by-points.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TournamentCsgoComponent', () => {
  let component: TournamentCsgoComponent;
  let fixture: ComponentFixture<TournamentCsgoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TournamentCsgoComponent
      ],
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
