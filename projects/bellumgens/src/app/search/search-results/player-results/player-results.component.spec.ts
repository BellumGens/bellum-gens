import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerResultsComponent } from './player-results.component';
import { ActivatedRoute, Router, UrlTree, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import { ApplicationUser, CSGODetails, PlaystyleRole } from '../../../../../../common/src/public_api';
import { environment } from '../../../../../../common/src/environments/environment';

const csgoDetails = (overrides: Partial<CSGODetails> = {}): CSGODetails => ({
  steamUser: null,
  userStats: null,
  primaryRole: PlaystyleRole.IGL,
  secondaryRole: PlaystyleRole.Awper,
  headshotPercentage: 45.6,
  killDeathRatio: 1.25,
  accuracy: 20,
  steamPrivate: false,
  realName: 'Real Name',
  customUrl: 'custom-url',
  avatarFull: '',
  avatarMedium: '',
  avatarIcon: '',
  ...overrides
});

const player = (id: string, username: string, details?: CSGODetails): ApplicationUser => ({
  id,
  steamId: id,
  username,
  battleNetId: null,
  email: null,
  searchVisible: true,
  externalLogins: [],
  steamUserException: false,
  userStatsException: false,
  registered: true,
  csgoDetails: details
});

describe('PlayerResultsComponent', () => {
  let component: PlayerResultsComponent;
  let fixture: ComponentFixture<PlayerResultsComponent>;
  let params: BehaviorSubject<Record<string, string>>;
  let httpMock: HttpTestingController;
  let iconService: IgxIconService;
  const searchUrl = (query: string) => `${environment.apiEndpoint}/search/players?${query}`;

  const configure = async (platformId = 'browser') => {
    params = new BehaviorSubject<Record<string, string>>({});
    await TestBed.configureTestingModule({
      imports: [
        PlayerResultsComponent
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params, data: new BehaviorSubject({}) } },
        { provide: PLATFORM_ID, useValue: platformId },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    iconService = TestBed.inject(IgxIconService);
    vi.spyOn(iconService, 'addSvgIcon').mockImplementation(() => undefined);
  };

  const create = () => {
    fixture = TestBed.createComponent(PlayerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;

  afterEach(() => {
    httpMock.verify();
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await configure();
      create();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should register the headshot icon', () => {
      expect(iconService.addSvgIcon).toHaveBeenCalledWith('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
    });

    it('should set the default page title from the route data', () => {
      expect(TestBed.inject(Title).getTitle()).toContain('Bellum Gens');
    });

    it('should not search when the route has no query', () => {
      httpMock.expectNone(() => true);
      expect(component.query()).toBeNull();
      expect(component.players()).toBeNull();
      expect(el().querySelector('h4').textContent).toContain('results for players with no search criteria');
      expect(el().querySelectorAll('igx-card').length).toBe(0);
    });

    it('should search for players when the route has a query and show a loader while loading', async () => {
      params.next({ query: 'role=1&overlap=5' });
      const req = httpMock.expectOne(searchUrl('role=1&overlap=5'));
      expect(req.request.withCredentials).toBe(true);
      expect(component.query()).toBe('role=1&overlap=5');
      expect(component.loading()).toBe(true);

      await fixture.whenStable();
      expect(el().querySelector('bg-loading')).toBeTruthy();
      expect(el().querySelector('.card-wrapper')).toBeNull();

      req.flush([]);
      await fixture.whenStable();
      expect(el().querySelector('bg-loading')).toBeNull();
      expect(el().querySelector('h4 .highlight').textContent.trim()).toBe('0');
      expect(el().querySelector('h4').textContent)
        .toContain('results for players playing as IGL with availability overlap of at least 5 hours');
    });

    it('should render a card per player with stats, roles and profile links', async () => {
      params.next({ query: 'overlap=0' });
      httpMock.expectOne(searchUrl('overlap=0')).flush([
        player('p1', 'PublicPlayer', csgoDetails()),
        player('p2', 'PrivatePlayer', csgoDetails({ steamPrivate: true, customUrl: null, realName: 'Hidden' })),
        player('p3', 'NoDetails')
      ]);
      await fixture.whenStable();

      expect(el().querySelector('h4 .highlight').textContent.trim()).toBe('3');
      const cards = el().querySelectorAll('igx-card');
      expect(cards.length).toBe(3);

      // Public player: stats + role chips; links to the steam custom url
      const publicCard = cards[0] as HTMLElement;
      expect(publicCard.textContent).toContain('PublicPlayer');
      expect(publicCard.textContent).toContain('Real Name');
      expect(publicCard.textContent).toContain('1.25');
      expect(publicCard.textContent).toContain('45.60%');
      expect(publicCard.querySelector('igx-circular-bar')).toBeTruthy();
      expect(publicCard.textContent).not.toContain('Private');
      const chips = Array.from(publicCard.querySelectorAll('igx-chip')).map(c => c.textContent.trim());
      expect(chips).toEqual(['IGL', 'Awper']);

      // Private player: no stats, but still shows preferred roles
      const privateCard = cards[1] as HTMLElement;
      expect(privateCard.textContent).toContain('Private');
      expect(privateCard.textContent).toContain('Hidden');
      expect(privateCard.querySelector('igx-circular-bar')).toBeNull();
      expect(privateCard.querySelector('igx-card-content')).toBeTruthy();

      // Player without csgo details: neither stats nor roles
      const bareCard = cards[2] as HTMLElement;
      expect(bareCard.textContent).toContain('NoDetails');
      expect(bareCard.textContent).not.toContain('Private');
      expect(bareCard.querySelector('igx-circular-bar')).toBeNull();
      expect(bareCard.querySelector('igx-card-content')).toBeNull();
    });

    it('should render a placeholder chip for roles the player has not set', async () => {
      params.next({ query: 'overlap=0' });
      httpMock.expectOne(searchUrl('overlap=0')).flush([
        player('p1', 'NoRoles', csgoDetails({ primaryRole: undefined, secondaryRole: null }))
      ]);
      await fixture.whenStable();

      const chips = Array.from(el().querySelectorAll('igx-card igx-chip')).map(c => c.textContent.trim());
      expect(chips).toEqual(['---', '---']);
    });

    it('should link each card to the player custom url, falling back to the id', async () => {
      params.next({ query: 'overlap=0' });
      httpMock.expectOne(searchUrl('overlap=0')).flush([
        player('p1', 'WithUrl', csgoDetails({ customUrl: 'with-url' })),
        player('p2', 'WithoutUrl', csgoDetails({ customUrl: null })),
        player('p3', 'NoDetails')
      ]);
      await fixture.whenStable();

      const router = TestBed.inject(Router);
      const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      const cards = el().querySelectorAll<HTMLElement>('igx-card');
      cards.forEach(card => card.click());

      const urls = navigate.mock.calls.map(([url]) => router.serializeUrl(url as UrlTree));
      expect(urls).toEqual(['/players/with-url', '/players/p2', '/players/p3']);
    });

    it('should stop loading and show no results when the search fails', async () => {
      params.next({ query: 'role=2&overlap=10' });
      httpMock.expectOne(searchUrl('role=2&overlap=10'))
        .flush('error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(component.loading()).toBe(false);
      expect(el().querySelector('bg-loading')).toBeNull();
      expect(el().querySelector('h4 .highlight').textContent.trim()).toBe('0');
    });
  });

  describe('on the server', () => {
    beforeEach(async () => {
      await configure('server');
      create();
    });

    it('should not register the headshot icon', () => {
      expect(iconService.addSvgIcon).not.toHaveBeenCalled();
    });
  });
});
