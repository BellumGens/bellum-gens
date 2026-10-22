import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamResultsComponent } from './team-results.component';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { IgxCardModule } from '@infragistics/igniteui-angular/card';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { ActivatedRoute, Router, UrlTree, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { QueryParsedPipe } from 'projects/bellumgens/src/app/pipes/query-parsed.pipe';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CSGOTeam } from '../../../../../../common/src/public_api';
import { environment } from '../../../../../../common/src/environments/environment';

const team = (teamId: string, teamName: string, description: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: '',
  description,
  visible: true,
  customUrl: `${teamId}-url`
});

describe('TeamResultsComponent', () => {
  let component: TeamResultsComponent;
  let fixture: ComponentFixture<TeamResultsComponent>;
  let params: BehaviorSubject<Record<string, string>>;
  let httpMock: HttpTestingController;
  const searchUrl = (query: string) => `${environment.apiEndpoint}/search/teams?${query}`;
  const el = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    params = new BehaviorSubject<Record<string, string>>({});
    await TestBed.configureTestingModule({
    imports: [
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        TeamResultsComponent,
        QueryParsedPipe],
    providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params, data: new BehaviorSubject({}) } },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not search when the route has no query', () => {
    httpMock.expectNone(() => true);
    expect(component.query()).toBeNull();
    expect(component.teams()).toBeNull();
    expect(el().querySelector('h4').textContent).toContain('results for teams with no search criteria');
    expect(el().querySelectorAll('igx-card').length).toBe(0);
  });

  it('should search for teams when the route has a query and show a loader while loading', async () => {
    params.next({ query: 'role=3&overlap=20' });
    const req = httpMock.expectOne(searchUrl('role=3&overlap=20'));
    expect(req.request.withCredentials).toBe(true);
    expect(component.query()).toBe('role=3&overlap=20');
    expect(component.loading()).toBe(true);

    await fixture.whenStable();
    expect(el().querySelector('bg-loading')).toBeTruthy();
    expect(el().querySelector('.card-wrapper')).toBeNull();

    req.flush([]);
    await fixture.whenStable();
    expect(el().querySelector('bg-loading')).toBeNull();
    expect(el().querySelector('h4 .highlight').textContent.trim()).toBe('0');
    expect(el().querySelector('h4').textContent)
      .toContain('results for teams looking for Entry with availability overlap of at least 20 hours');
  });

  it('should render a card per team with name and description', async () => {
    params.next({ query: 'overlap=0' });
    httpMock.expectOne(searchUrl('overlap=0')).flush([
      team('t1', 'Team One', 'First team'),
      team('t2', 'Team Two', 'Second team')
    ]);
    await fixture.whenStable();

    expect(el().querySelector('h4 .highlight').textContent.trim()).toBe('2');
    const cards = el().querySelectorAll('igx-card');
    expect(cards.length).toBe(2);
    expect(cards[0].querySelector('h3').textContent).toContain('Team One');
    expect(cards[0].querySelector('igx-card-content').textContent).toContain('First team');
    expect(cards[1].querySelector('h3').textContent).toContain('Team Two');
    expect(cards[1].querySelector('igx-card-content').textContent).toContain('Second team');
  });

  it('should navigate to the team page when a card is clicked', async () => {
    params.next({ query: 'overlap=0' });
    httpMock.expectOne(searchUrl('overlap=0')).flush([team('t1', 'Team One', 'First team')]);
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const link = el().querySelector<HTMLAnchorElement>('igx-card h3 a.card-link');
    expect(link.getAttribute('href')).toBe('/team/t1-url');
    expect(link.textContent.trim()).toBe('Team One');
    link.click();

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(router.serializeUrl(navigate.mock.calls[0][0] as UrlTree)).toBe('/team/t1-url');
  });

  it('should stop loading and show no results when the search fails', async () => {
    params.next({ query: 'role=1&overlap=5' });
    httpMock.expectOne(searchUrl('role=1&overlap=5'))
      .flush('error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(component.loading()).toBe(false);
    expect(el().querySelector('bg-loading')).toBeNull();
    expect(el().querySelector('h4 .highlight').textContent.trim()).toBe('0');
  });
});
