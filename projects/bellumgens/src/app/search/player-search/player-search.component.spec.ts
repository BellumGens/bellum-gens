import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search.component';
import { Router, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationUser, CSGOTeam, PlaystyleRole } from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';

const authUser = { id: 'user-id', username: 'TestUser' } as ApplicationUser;

const team = (teamId: string, teamName: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: '',
  visible: true
});

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;
  let router: Router;
  let navigate: ReturnType<typeof vi.spyOn>;
  let httpMock: HttpTestingController;
  const teamsAdminUrl = `${environment.authApiEndpoint}/userteamsadmin`;
  const el = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        PlayerSearchComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  const submit = async () => {
    el().querySelector<HTMLButtonElement>('button.search-button').click();
    await fixture.whenStable();
  };

  const radioInputs = (groupId: string) =>
    Array.from(el().querySelectorAll<HTMLInputElement>(`#${groupId} input[type="radio"]`));

  /** Logs a user in through the `authUser` input. */
  const login = async () => {
    fixture.componentRef.setInput('authUser', authUser);
    await fixture.whenStable();
  };

  /** Picks "Team practice" overlap, which lazily requests the teams the user administers. */
  const chooseTeamPractice = async (teams: CSGOTeam []) => {
    radioInputs('availability')[1].click();
    await fixture.whenStable();
    httpMock.expectOne(teamsAdminUrl).flush(teams);
    await fixture.whenStable();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchModel', () => {
    expect(component.searchModel()).toEqual({ role: null, scheduleOverlap: 0, teamId: undefined });
  });

  it('should initialize userOverlap to 0', () => {
    expect(component.userOverlap()).toBe(0);
  });

  it('should initialize teamName', () => {
    expect(component.teamName()).toBe('Select Team');
  });

  it('should have activeLineup with 5 roles', () => {
    expect(component.activeLineup).toBeDefined();
    expect(component.activeLineup.length).toBe(5);
  });

  describe('without a logged in user', () => {
    it('should render one role radio per lineup slot and no availability filters', () => {
      const radios = el().querySelectorAll('#lineup igx-radio');
      expect(Array.from(radios).map(r => r.textContent.trim()))
        .toEqual(['IGL', 'Awper', 'Entry Fragger', 'Support', 'Lurker']);
      expect(el().querySelector('#availability')).toBeNull();
      expect(el().querySelector('igx-slider')).toBeNull();
    });

    it('should not request the administered teams', () => {
      httpMock.expectNone(teamsAdminUrl);
      expect(component.teamAdmin()).toBeNull();
    });

    it('should navigate with only the overlap when no role is selected', async () => {
      await submit();

      expect(navigate).toHaveBeenCalledWith(['search/players', 'overlap=0']);
    });

    it('should navigate with the role picked in the radio group', async () => {
      radioInputs('lineup')[1].click();
      await fixture.whenStable();
      expect(component.role()).toBe(PlaystyleRole.Awper);

      await submit();

      expect(navigate).toHaveBeenCalledWith(['search/players', `role=${PlaystyleRole.Awper}&overlap=0`]);
    });
  });

  describe('with a logged in user', () => {
    beforeEach(async () => {
      await login();
    });

    it('should show the availability filters without requesting the administered teams', () => {
      httpMock.expectNone(teamsAdminUrl);
      expect(el().querySelector('#availability')).toBeTruthy();
      expect(el().querySelector('igx-slider')).toBeTruthy();
      expect(el().querySelector('igx-select')).toBeNull();
    });

    it('should render integer tick labels on the overlap slider', () => {
      const labels = Array.from(el().querySelectorAll('igx-slider .igx-ticks__label'))
        .map(l => l.textContent.trim())
        .filter(Boolean);
      expect(labels).toContain('0');
      expect(labels).toContain('40');
    });

    it('should load the administered teams and show them for selection when team practice is chosen', async () => {
      await chooseTeamPractice([team('t1', 'Team One'), team('t2', 'Team Two')]);

      expect(component.userOverlap()).toBe(1);
      expect(component.teamAdmin()).toEqual([team('t1', 'Team One'), team('t2', 'Team Two')]);
      const items = el().querySelectorAll('igx-select-item .title');
      expect(Array.from(items).map(i => i.textContent.trim())).toEqual(['Team One', 'Team Two']);
    });

    it('should not show the team selection when the user administers no teams', async () => {
      await chooseTeamPractice([]);

      expect(component.userOverlap()).toBe(1);
      expect(el().querySelector('igx-select')).toBeNull();
    });

    it('should include the selected team and overlap in the search query', async () => {
      await chooseTeamPractice([team('t1', 'Team One')]);

      radioInputs('lineup')[0].click();
      el().querySelector<HTMLElement>('igx-select-item').click();
      const thumb = el().querySelector<HTMLElement>('igx-slider igx-thumb');
      for (let i = 0; i < 3; i++) {
        thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      }
      await fixture.whenStable();
      expect(component.teamId()).toBe('t1');
      expect(component.scheduleOverlap()).toBe(15);

      await submit();

      expect(navigate).toHaveBeenCalledWith(['search/players', `role=${PlaystyleRole.IGL}&teamid=t1&overlap=15`]);
      expect(component.teamId()).toBe('t1');
    });

    it('should drop a previously selected team when searching by personal availability', async () => {
      await chooseTeamPractice([team('t1', 'Team One')]);
      component.teamId.set('t1');
      component.teamName.set('Team One');
      radioInputs('availability')[0].click();
      await fixture.whenStable();
      expect(component.userOverlap()).toBe(0);

      await submit();

      expect(navigate).toHaveBeenCalledWith(['search/players', 'overlap=0']);
      expect(component.teamId()).toBeNull();
      expect(component.teamName()).toBe('Select Team');
    });
  });
});
