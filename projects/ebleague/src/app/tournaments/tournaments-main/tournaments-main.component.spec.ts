import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsMainComponent } from './tournaments-main.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { ApiTournamentsService, Tournament } from 'projects/common/src/public_api';

describe('TournamentsMainComponent', () => {
  let component: TournamentsMainComponent;
  let fixture: ComponentFixture<TournamentsMainComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentsMainComponent],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tournaments observable and filter data correctly', () => {
    const now = Date.now();
    const twoDaysAgo = new Date(now - 172800000); // 2 days ago
    const oneDayAgo = new Date(now - 86400000); // 1 day ago
    const oneDayFromNow = new Date(now + 86400000); // 1 day from now
    const twoDaysFromNow = new Date(now + 172800000); // 2 days from now

    const tournaments: Tournament[] = [
      { id: '1', name: 'Active Current Tournament', active: true, startDate: oneDayAgo, endDate: oneDayFromNow },
      { id: '2', name: 'Inactive Tournament', active: false, startDate: oneDayAgo, endDate: oneDayFromNow },
      { id: '3', name: 'Past Tournament', active: true, startDate: twoDaysAgo, endDate: oneDayAgo },
      { id: '4', name: 'Upcoming Tournament', active: true, startDate: oneDayFromNow, endDate: twoDaysFromNow }
    ];

    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(tournaments);

    // tournaments array: active=true (id 1, 3, 4)
    expect(component.tournaments().length).toBe(3);
    // past array: endDate < now (id 3)
    expect(component.past().length).toBe(1);
    expect(component.past()[0].id).toBe('3');
    // upcoming array: startDate > now (id 4)
    expect(component.upcoming().length).toBe(1);
    expect(component.upcoming()[0].id).toBe('4');
  });

  describe('rendering', () => {
    const day = 86400000;
    const tournamentsUrl = () => `${apiService['_apiEndpoint']}/tournament/tournaments`;
    let now: number;

    const flushTournaments = async (tournaments: Tournament[]) => {
      httpMock.expectOne(tournamentsUrl()).flush(tournaments);
      fixture.detectChanges();
      await fixture.whenStable();
    };

    const sections = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('section.season-section'));
    const heading = (section: HTMLElement) => section.querySelector('h2')!.textContent!.trim();

    beforeEach(() => {
      now = Date.now();
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should render the header with a link to all tournaments', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('h1')!.textContent).toContain('EBL Seasons');
      const link = el.querySelector('header a') as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe('/tournaments');
      httpMock.expectOne(tournamentsUrl()).flush([]);
    });

    it('should render the empty state while tournaments are not yet loaded', () => {
      expect(component.tournaments()).toEqual([]);
      expect(component.past()).toEqual([]);
      expect(component.upcoming()).toEqual([]);
      expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
      httpMock.expectOne(tournamentsUrl()).flush([]);
    });

    it('should render the empty state and no upcoming/past sections when there are no tournaments', async () => {
      await flushTournaments([]);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.empty-state')).toBeTruthy();
      expect(el.querySelector('.empty-state p')!.textContent).toContain('No active seasons at the moment');
      expect(el.querySelectorAll('igx-card').length).toBe(0);
      expect(el.querySelectorAll('igx-divider').length).toBe(0);
      expect(sections().length).toBe(1);
    });

    it('should render active, upcoming and past sections with cards', async () => {
      await flushTournaments([
        {
          id: 'a1', name: 'Active Season', active: true, logo: '/assets/active.png', description: 'Active description',
          startDate: new Date(now - day), endDate: new Date(now + day)
        },
        {
          id: 'u1', name: 'Upcoming Season', active: false, logo: '/assets/upcoming.png', description: 'Upcoming description',
          startDate: new Date(now + day), endDate: new Date(now + 2 * day)
        },
        {
          id: 'p1', name: 'Past Season', active: false, logo: '/assets/past.png', description: 'Past description',
          startDate: new Date(now - 2 * day), endDate: new Date(now - day)
        }
      ]);

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.empty-state')).toBeNull();
      expect(el.querySelectorAll('igx-divider').length).toBe(2);

      expect(sections().length).toBe(3);
      const [active, upcoming, past] = sections();
      expect(heading(active)).toContain('Active Seasons');
      expect(heading(upcoming)).toContain('Upcoming Seasons');
      expect(heading(past)).toContain('Past Seasons');

      // Active section
      const activeCards = active.querySelectorAll('igx-card');
      expect(activeCards.length).toBe(1);
      expect(activeCards[0].querySelector('h3')!.textContent).toContain('Active Season');
      expect(activeCards[0].querySelector('img')!.getAttribute('alt')).toBe('Active Season');
      expect(activeCards[0].querySelector('img')!.getAttribute('src')).toContain('/assets/active.png');
      expect(activeCards[0].querySelector('.card-desc')!.textContent).toContain('Active description');
      expect(activeCards[0].querySelector('igx-chip.status-active')!.textContent).toContain('Active');
      const activeLinks = Array.from(activeCards[0].querySelectorAll('.game-links a')).map(a => a.getAttribute('href'));
      expect(activeLinks).toEqual(['/csgo/a1', '/sc2/a1']);

      // Upcoming section
      const upcomingCards = upcoming.querySelectorAll('igx-card');
      expect(upcomingCards.length).toBe(1);
      expect(upcomingCards[0].querySelector('h3')!.textContent).toContain('Upcoming Season');
      expect(upcomingCards[0].querySelector('img')!.getAttribute('alt')).toBe('Upcoming Season');
      expect(upcomingCards[0].querySelector('.card-desc')!.textContent).toContain('Upcoming description');
      expect(upcomingCards[0].querySelector('igx-chip.status-upcoming')!.textContent).toContain('Upcoming');
      expect(upcomingCards[0].querySelector('.game-links')).toBeNull();

      // Past section
      const pastCards = past.querySelectorAll('igx-card');
      expect(pastCards.length).toBe(1);
      expect(pastCards[0].querySelector('h3')!.textContent).toContain('Past Season');
      expect(pastCards[0].querySelector('img')!.getAttribute('alt')).toBe('Past Season');
      expect(pastCards[0].querySelector('.card-desc')!.textContent).toContain('Past description');
      expect(pastCards[0].querySelector('igx-chip.status-completed')!.textContent).toContain('Completed');
      const pastLinks = Array.from(pastCards[0].querySelectorAll('.game-links a')).map(a => a.getAttribute('href'));
      expect(pastLinks).toEqual(['/csgo/p1', '/sc2/p1']);
    });

    it('should omit media and description when a tournament has no logo or description', async () => {
      await flushTournaments([
        { id: 'a1', name: 'Active Plain', active: true, startDate: new Date(now - day), endDate: new Date(now + day) },
        { id: 'u1', name: 'Upcoming Plain', active: false, startDate: new Date(now + day), endDate: new Date(now + 2 * day) },
        { id: 'p1', name: 'Past Plain', active: false, startDate: new Date(now - 2 * day), endDate: new Date(now - day) }
      ]);

      const cards: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('igx-card');
      expect(cards.length).toBe(3);
      cards.forEach(card => {
        expect(card.querySelector('igx-card-media')).toBeNull();
        expect(card.querySelector('img')).toBeNull();
        expect(card.querySelector('.card-desc')).toBeNull();
      });
    });

    it('should render formatted start and end dates on cards', async () => {
      const startDate = new Date(2020, 0, 15);
      const endDate = new Date(2020, 1, 20);
      await flushTournaments([{ id: 'p1', name: 'Dated', active: true, startDate, endDate }]);

      const dates = Array.from(fixture.nativeElement.querySelectorAll('.card-date') as NodeListOf<HTMLElement>)
        .map(d => d.textContent!.replace(/\s+/g, ' '));
      // rendered once in the active section and once in the past section
      expect(dates.length).toBe(2);
      dates.forEach(text => {
        expect(text).toContain('Jan 15, 2020');
        expect(text).toContain('Feb 20, 2020');
      });
    });

    it('should hide the upcoming and past sections when only current active tournaments are present', async () => {
      await flushTournaments([
        { id: 'a1', name: 'Only Active', active: true, startDate: new Date(now - day), endDate: new Date(now + day) },
        { id: 'a2', name: 'Another Active', active: true, startDate: new Date(now - day), endDate: new Date(now + day) }
      ]);

      expect(sections().length).toBe(1);
      expect(sections()[0].querySelectorAll('igx-card').length).toBe(2);
      expect(fixture.nativeElement.querySelector('.empty-state')).toBeNull();
      expect(fixture.nativeElement.querySelectorAll('igx-divider').length).toBe(0);
    });

    it('should show the empty state alongside past seasons when none are active', async () => {
      await flushTournaments([
        { id: 'p1', name: 'Past Only', active: false, startDate: new Date(now - 2 * day), endDate: new Date(now - day) }
      ]);

      expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
      expect(sections().length).toBe(2);
      expect(heading(sections()[1])).toContain('Past Seasons');
      expect(fixture.nativeElement.querySelectorAll('igx-divider').length).toBe(1);
    });

    it('should navigate to the game route when a game link is clicked', async () => {
      await flushTournaments([
        { id: 'a1', name: 'Active Season', active: true, startDate: new Date(now - day), endDate: new Date(now + day) }
      ]);
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

      const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('.game-links a');
      links[0].click();
      links[1].click();

      expect(navigateSpy).toHaveBeenCalledTimes(2);
      expect(router.serializeUrl(navigateSpy.mock.calls[0][0] as UrlTree)).toBe('/csgo/a1');
      expect(router.serializeUrl(navigateSpy.mock.calls[1][0] as UrlTree)).toBe('/sc2/a1');
    });
  });
});
