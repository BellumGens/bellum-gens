import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamResultsComponent } from './team-results.component';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { IgxCardModule } from '@infragistics/igniteui-angular/card';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QueryParsedPipe } from 'projects/bellumgens/src/app/pipes/query-parsed.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamResultsComponent', () => {
  let component: TeamResultsComponent;
  let fixture: ComponentFixture<TeamResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        TeamResultsComponent,
        QueryParsedPipe],
    providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
