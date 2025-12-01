import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarComponent, IgxBadgeComponent, IgxCircularProgressBarComponent, IgxDividerDirective, IgxIconComponent, IGX_CARD_DIRECTIVES, IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular';
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
        IgxAvatarComponent,
        IGX_CARD_DIRECTIVES,
        IgxBadgeComponent,
        IgxCircularProgressBarComponent,
        IgxDividerDirective,
        IGX_GRID_DIRECTIVES,
        IgxIconComponent,
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
