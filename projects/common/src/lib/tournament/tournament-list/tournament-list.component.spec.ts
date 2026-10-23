import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { By } from '@angular/platform-browser';
import { config } from 'rxjs';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';

import { TournamentListComponent } from './tournament-list.component';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../services/login.service';
import { CommunicationService } from '../../../services/communication.service';
import { Tournament, TournamentStatus } from '../../../models/tournament';
import { ApplicationUser } from '../../../models/applicationuser';

describe('TournamentListComponent', () => {
  let component: TournamentListComponent;
  let fixture: ComponentFixture<TournamentListComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let loginService: LoginService;
  let commService: CommunicationService;
  let router: Router;

  const tournamentsUrl = () => `${apiService['_apiEndpoint']}/tournament/tournaments`;
  const myTournamentsUrl = () => `${apiService['_apiEndpoint']}/tournament/mytournaments`;

  const flushInitial = (publicList: Tournament[] = [], myList: Tournament[] = [], user: ApplicationUser = null) => {
    httpMock.expectOne(tournamentsUrl()).flush(publicList);
    httpMock.expectOne(myTournamentsUrl()).flush(myList);
    httpMock.expectOne(loginService['_apiEndpoint']).flush(user);
    fixture.detectChanges();
  };

  const host = (): HTMLElement => fixture.nativeElement;
  const tabContents = (): HTMLElement[] => Array.from(host().querySelectorAll('igx-tab-content'));
  // igx-tab-content only renders its content for the selected tab
  const showTab = async (index: number): Promise<HTMLElement> => {
    component.activeTab.set(index);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return tabContents()[index];
  };
  const cardNames = (tab: HTMLElement) => Array.from(tab.querySelectorAll('bg-tournament-card h3')).map(h => h.textContent.trim());
  const headerButton = (text: string): HTMLButtonElement =>
    Array.from(host().querySelectorAll<HTMLButtonElement>('.header-actions button')).find(b => b.textContent.includes(text));
  const inviteDialog = (): IgxDialogComponent => fixture.debugElement.query(By.directive(IgxDialogComponent)).componentInstance;
  const dialogButton = (text: string): HTMLButtonElement =>
    Array.from(document.querySelectorAll<HTMLButtonElement>('[igxDialogActions] button')).find(b => b.textContent.includes(text));
  const inviteInput = (): HTMLInputElement => document.querySelector('input[name="inviteCode"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentListComponent],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
    loginService = TestBed.inject(LoginService);
    commService = TestBed.inject(CommunicationService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    config.onUnhandledError = null;
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    flushInitial();
  });

  it('should start with loading true and show a progress indicator', async () => {
    expect(component.loading()).toBe(true);
    const active = await showTab(0);
    expect(active.querySelector('igx-circular-bar')).not.toBeNull();
    expect(active.querySelector('.empty-state')).toBeNull();
    flushInitial();
  });

  it('should set loading to false after tournaments load', async () => {
    const tournaments: Tournament[] = [
      { id: '1', name: 'Tournament 1', status: TournamentStatus.Open }
    ];

    flushInitial(tournaments);

    expect(component.loading()).toBe(false);
    expect(component.tournaments().length).toBe(1);
    const active = await showTab(0);
    expect(active.querySelector('igx-circular-bar')).toBeNull();
    expect(cardNames(active)).toEqual(['Tournament 1']);
  });

  it('should filter active tournaments', async () => {
    const tournaments: Tournament[] = [
      { id: '1', name: 'Open', status: TournamentStatus.Open },
      { id: '2', name: 'InProgress', status: TournamentStatus.InProgress },
      { id: '3', name: 'Completed', status: TournamentStatus.Completed },
      { id: '4', name: 'Draft', status: TournamentStatus.Draft }
    ];

    flushInitial(tournaments);

    expect(component.activeTournaments().length).toBe(2);
    expect(component.completedTournaments().length).toBe(1);
    expect(cardNames(await showTab(0))).toEqual(['Open', 'InProgress']);
    expect(cardNames(await showTab(2))).toEqual(['Completed']);
  });

  it('should list only drafts starting in the future as upcoming', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));

    const tournaments: Tournament[] = [
      { id: '1', name: 'Future draft', status: TournamentStatus.Draft, startDate: new Date('2026-07-01T00:00:00Z') },
      { id: '2', name: 'Past draft', status: TournamentStatus.Draft, startDate: new Date('2026-05-01T00:00:00Z') },
      { id: '3', name: 'Undated draft', status: TournamentStatus.Draft },
      { id: '4', name: 'Future open', status: TournamentStatus.Open, startDate: new Date('2026-07-01T00:00:00Z') }
    ];

    flushInitial(tournaments);

    expect(component.upcomingTournaments().map(t => t.id)).toEqual(['1']);
    expect(cardNames(await showTab(1))).toEqual(['Future draft']);
  });

  it('should derive the tabs of API tournaments that come without a status', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));

    // The API only sends id, name, description, logo, dates and the active flag (dates as strings)
    const tournaments = [
      { id: '1', name: 'Running', active: true, startDate: '2026-05-25T00:00:00Z', endDate: '2026-06-10T00:00:00Z' },
      { id: '2', name: 'Next month', active: false, startDate: '2026-07-01T00:00:00Z', endDate: '2026-07-05T00:00:00Z' },
      { id: '3', name: 'Last month', active: false, startDate: '2026-05-01T00:00:00Z', endDate: '2026-05-05T00:00:00Z' }
    ] as unknown as Tournament[];

    flushInitial(tournaments);

    const active = await showTab(0);
    expect(cardNames(active)).toEqual(['Running']);
    expect(active.querySelector('igx-chip.status-in-progress').textContent).toContain('In Progress');
    const upcoming = await showTab(1);
    expect(cardNames(upcoming)).toEqual(['Next month']);
    expect(upcoming.querySelector('igx-chip.status-open').textContent).toContain('Open');
    const completed = await showTab(2);
    expect(cardNames(completed)).toEqual(['Last month']);
    expect(completed.querySelector('igx-chip.status-completed').textContent).toContain('Completed');
  });

  it('should show empty states when there are no tournaments', async () => {
    flushInitial();

    const emptyTitle = async (index: number) => (await showTab(index)).querySelector('.empty-state h3').textContent;
    expect(await emptyTitle(0)).toContain('No active tournaments');
    expect(await emptyTitle(1)).toContain('No upcoming tournaments');
    expect(await emptyTitle(2)).toContain('No completed tournaments yet');
    expect(await emptyTitle(3)).toContain('You haven\'t created any tournaments');
    expect(host().querySelectorAll('bg-tournament-card').length).toBe(0);
  });

  it('should switch tabs when a tab header is clicked', async () => {
    flushInitial([], [{ id: 'm1', name: 'Mine', status: TournamentStatus.Draft }]);
    await showTab(0);

    host().querySelectorAll<HTMLElement>('igx-tab-header')[3].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.activeTab()).toBe(3);
    expect(cardNames(tabContents()[3])).toEqual(['Mine']);
  });

  it('should treat a null server response as no tournaments and stop loading', async () => {
    httpMock.expectOne(tournamentsUrl()).flush(null);
    httpMock.expectOne(myTournamentsUrl()).flush(null);
    httpMock.expectOne(loginService['_apiEndpoint']).flush(null);

    expect(component.tournaments()).toEqual([]);
    expect(component.myTournaments()).toEqual([]);
    expect(component.loading()).toBe(false);
    const active = await showTab(0);
    expect(active.querySelector('igx-circular-bar')).toBeNull();
    expect(active.querySelector('.empty-state h3').textContent).toContain('No active tournaments');
  });

  it('should stop loading and show the empty state when the tournaments fail to load', async () => {
    const unhandled = vi.fn();
    config.onUnhandledError = unhandled;

    httpMock.expectOne(tournamentsUrl()).flush('Server error', { status: 500, statusText: 'Server Error' });
    httpMock.expectOne(myTournamentsUrl()).flush([]);
    httpMock.expectOne(loginService['_apiEndpoint']).flush(null);
    // RxJS reports unhandled errors from a timer, so give it one macrotask
    await new Promise(resolve => setTimeout(resolve));

    expect(unhandled).not.toHaveBeenCalled();
    expect(component.loading()).toBe(false);
    expect(component.tournaments()).toEqual([]);
    const active = await showTab(0);
    expect(active.querySelector('igx-circular-bar')).toBeNull();
    expect(active.querySelector('.empty-state h3').textContent).toContain('No active tournaments');
  });

  it('should reflect the logged in user', () => {
    expect(component.isLoggedIn()).toBe(false);

    flushInitial([], [], { id: 'user-1' } as ApplicationUser);

    expect(component.isLoggedIn()).toBe(true);
  });

  it('should navigate to create on createTournament', () => {
    flushInitial();
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.createTournament();
    expect(spy).toHaveBeenCalledWith(['/tournaments/create']);
  });

  it('should navigate to create from the header and the empty My Tournaments tab', async () => {
    flushInitial();
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);

    headerButton('Create Tournament').click();
    (await showTab(3)).querySelector<HTMLButtonElement>('.empty-state button').click();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, ['/tournaments/create']);
    expect(spy).toHaveBeenNthCalledWith(2, ['/tournaments/create']);
  });

  it('should navigate to manage on manageTournament', () => {
    flushInitial();
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.manageTournament({ id: 't1', name: 'Test' });
    expect(spy).toHaveBeenCalledWith(['/tournaments/manage', 't1']);
  });

  describe('my tournaments', () => {
    const mine: Tournament[] = [
      { id: 'm1', name: 'Mine 1', status: TournamentStatus.Draft },
      { id: 'm2', name: 'Mine 2', status: TournamentStatus.Open }
    ];
    let myTab: HTMLElement;

    beforeEach(async () => {
      flushInitial([{ id: 'p1', name: 'Public', status: TournamentStatus.Open }], mine);
      myTab = await showTab(3);
    });

    it('should list my tournaments with manage actions', async () => {
      expect(cardNames(myTab)).toEqual(['Mine 1', 'Mine 2']);
      expect(myTab.querySelectorAll('button.danger-btn').length).toBe(2);
      // public tabs don't offer manage actions
      const active = await showTab(0);
      expect(cardNames(active)).toEqual(['Public']);
      expect(active.querySelector('button.danger-btn')).toBeNull();
    });

    it('should navigate to manage when a card emits manage', () => {
      const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
      const manageButtons = Array.from(myTab.querySelectorAll<HTMLButtonElement>('bg-tournament-card button'))
        .filter(b => b.textContent.includes('Manage'));

      manageButtons[1].click();

      expect(spy).toHaveBeenCalledWith(['/tournaments/manage', 'm2']);
    });

    it('should delete a tournament when a card emits deleteTournament', () => {
      let success: string;
      commService.success.subscribe(s => success = s);

      myTab.querySelectorAll<HTMLButtonElement>('button.danger-btn')[0].click();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete-tournament?id=m1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
      fixture.detectChanges();

      expect(success).toBe('Tournament deleted successfully!');
      expect(component.myTournaments().map(t => t.id)).toEqual(['m2']);
      expect(cardNames(myTab)).toEqual(['Mine 2']);
    });

    it('should keep the tournament when deletion fails', async () => {
      // the service reports the error and the component handles the rethrown one, so nothing is left unhandled
      const unhandled = vi.fn();
      config.onUnhandledError = unhandled;
      let error: string;
      commService.error.subscribe(e => error = e);

      myTab.querySelectorAll<HTMLButtonElement>('button.danger-btn')[1].click();

      httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete-tournament?id=m2`)
        .flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      fixture.detectChanges();

      // RxJS reports unhandled errors from a timer, so give it one macrotask
      await new Promise(resolve => setTimeout(resolve));

      expect(error).toContain('403 Forbidden');
      expect(unhandled).not.toHaveBeenCalled();
      expect(cardNames(myTab)).toEqual(['Mine 1', 'Mine 2']);
    });
  });

  describe('join by invite code', () => {
    const joinUrl = () => `${apiService['_apiEndpoint']}/tournament/join`;

    const typeCode = async (code: string) => {
      const input = inviteInput();
      input.value = code;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
    };

    beforeEach(async () => {
      flushInitial();
      headerButton('Join by Code').click();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    afterEach(() => inviteDialog().close());

    it('should have empty invite code initially', () => {
      expect(component.inviteCode).toBe('');
    });

    it('should open the invite dialog with the join button disabled', () => {
      expect(inviteDialog().isOpen).toBe(true);
      expect(dialogButton('Join').disabled).toBe(true);
    });

    it('should keep join disabled and not submit for a blank code', async () => {
      await typeCode('   ');

      expect(component.inviteCode).toBe('   ');
      expect(dialogButton('Join').disabled).toBe(true);

      component.joinByInvite(inviteDialog());
      httpMock.expectNone(joinUrl());
      expect(inviteDialog().isOpen).toBe(true);
    });

    it('should join with the trimmed code, then close the dialog and reset the code', async () => {
      let success: string;
      commService.success.subscribe(s => success = s);
      await typeCode('  ABC123 ');

      const joinButton = dialogButton('Join');
      expect(joinButton.disabled).toBe(false);
      joinButton.click();

      const req = httpMock.expectOne(joinUrl());
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ inviteCode: 'ABC123' });
      req.flush({ id: 't9', name: 'Joined' });
      fixture.detectChanges();

      expect(success).toBe('Successfully joined tournament!');
      expect(component.inviteCode).toBe('');
      await vi.waitFor(() => expect(inviteDialog().isOpen).toBe(false));
    });

    it('should keep the dialog open and the code when joining fails', async () => {
      // the service reports the error and the component handles the rethrown one, so nothing is left unhandled
      const unhandled = vi.fn();
      config.onUnhandledError = unhandled;
      let error: string;
      commService.error.subscribe(e => error = e);
      await typeCode('BADCODE');

      dialogButton('Join').click();
      httpMock.expectOne(joinUrl()).flush('Not found', { status: 404, statusText: 'Not Found' });
      fixture.detectChanges();

      // RxJS reports unhandled errors from a timer, so give it one macrotask
      await new Promise(resolve => setTimeout(resolve));

      expect(error).toContain('404 Not Found');
      expect(unhandled).not.toHaveBeenCalled();
      expect(component.inviteCode).toBe('BADCODE');
      expect(inviteDialog().isOpen).toBe(true);
    });

    it('should close the dialog on cancel', async () => {
      dialogButton('Cancel').click();

      await vi.waitFor(() => expect(inviteDialog().isOpen).toBe(false));
    });
  });
});
