import { Component, PLATFORM_ID, Signal, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ROUTER_OUTLET_DATA, Router, Routes, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { IgxIconService } from '@infragistics/igniteui-angular/icon';
import { TeamComponent } from './team.component';
import { TeamApplicationComponent } from './team-application/team-application.component';
import { ApplicationUser, CSGOTeam, TEAM_PLACEHOLDER } from '../../../../common/src/public_api';

const API = 'https://localhost:44348/api';
const AUTH_API = `${API}/account`;
const DISCORD_SVG = '/assets/login/discord.svg';

const TEAM: CSGOTeam = {
  teamId: 'team-1',
  teamName: 'Test Team',
  teamAvatar: 'https://example.com/avatar.png',
  description: 'The best test team',
  customUrl: 'test-team',
  discord: 'https://discord.gg/test-team',
  visible: true
};

const OTHER_TEAM: CSGOTeam = {
  teamId: 'team-2',
  teamName: 'Other Team',
  teamAvatar: '',
  description: 'Another team',
  customUrl: 'other-team',
  visible: true
};

const USER = { id: 'user-1', username: 'tester' } as ApplicationUser;

@Component({
  template: '<span class="team-child">{{ team()?.teamName }}</span>'
})
class TeamChildStubComponent {
  public team = inject(ROUTER_OUTLET_DATA) as Signal<CSGOTeam>;
}

const routes: Routes = [
  {
    path: 'team/:teamid',
    component: TeamComponent,
    children: [
      { path: 'details', component: TeamChildStubComponent },
      { path: 'competitions', component: TeamChildStubComponent },
      { path: 'strategies', component: TeamChildStubComponent },
      { path: 'preferences', component: TeamChildStubComponent }
    ]
  }
];

describe('TeamComponent', () => {
  let component: TeamComponent;
  let harness: RouterTestingHarness;
  const httpMock = () => TestBed.inject(HttpTestingController);

  const element = (): HTMLElement => harness.fixture.nativeElement;

  const tabLabels = () => Array.from(element().querySelectorAll('igx-tab-header [igxTabHeaderLabel]'))
    .map(header => header.textContent.trim());

  const flushUser = (user: ApplicationUser = null) => httpMock().expectOne(AUTH_API).flush(user);

  const flushSvgs = () => httpMock().match(DISCORD_SVG).forEach(req => req.flush('<svg></svg>'));

  /** Navigates to the team route and answers the team request (with the returned team, if any). */
  const navigate = async (teamId: string, team?: CSGOTeam) => {
    component = await harness.navigateByUrl(`/team/${teamId}`, TeamComponent);
    TestBed.tick();
    if (team) {
      httpMock().expectOne(`${API}/teams?teamid=${teamId}`).flush(team);
      TestBed.tick();
    }
  };

  const flushRoles = (teamId: string, member: boolean, admin: boolean) => {
    httpMock().expectOne(`${API}/teams/teammember?teamid=${teamId}`).flush(member);
    httpMock().expectOne(`${API}/teams/teamadmin?teamid=${teamId}`).flush(admin);
    flushSvgs();
  };

  const openTeam = async (team: CSGOTeam, { member = false, admin = false, user = null as ApplicationUser } = {}) => {
    harness = await RouterTestingHarness.create();
    await navigate(team.teamId, team);
    flushUser(user);
    flushRoles(team.teamId, member, admin);
    await harness.fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamComponent
      ],
      providers: [
        provideRouter(routes),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  afterEach(() => {
    httpMock().verify();
  });

  describe('without a team route parameter', () => {
    beforeEach(async () => {
      const fixture = TestBed.createComponent(TeamComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      flushUser();
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have a placeholder team initially', () => {
      expect(component.team()).toEqual(TEAM_PLACEHOLDER);
      expect(component.isAdmin()).toBe(false);
      expect(component.isMember()).toBe(false);
    });

    it('should not request a team or the user roles', () => {
      TestBed.tick();
      httpMock().expectNone(req => req.url.startsWith(`${API}/teams`));
    });
  });

  describe('with a team route parameter', () => {
    it('should load the team for the route parameter', async () => {
      await openTeam(TEAM);

      expect(component.team()).toEqual(TEAM);
      expect(TestBed.inject(Title).getTitle()).toBe('Counter-Strike Team: Test Team');
      expect(element().querySelector('h1').textContent).toContain('Test Team');
      expect(element().querySelector('h3').textContent).toContain('The best test team');
    });

    it('should keep the placeholder until the requested team arrives', async () => {
      harness = await RouterTestingHarness.create();
      await navigate(TEAM.teamId);
      flushUser();

      expect(component.team()).toEqual(TEAM_PLACEHOLDER);
      httpMock().expectNone(`${API}/teams/teammember?teamid=${TEAM.teamId}`);

      httpMock().expectOne(`${API}/teams?teamid=${TEAM.teamId}`).flush(TEAM);
      TestBed.tick();
      flushRoles(TEAM.teamId, false, false);

      expect(component.team()).toEqual(TEAM);
    });

    it('should resolve a team by its custom url', async () => {
      harness = await RouterTestingHarness.create();
      await navigate(TEAM.customUrl, TEAM);
      flushUser();
      flushRoles(TEAM.teamId, false, false);

      expect(component.team()).toEqual(TEAM);
    });

    it('should ignore the previous team while the newly requested one loads', async () => {
      await openTeam(TEAM, { member: true, admin: true });
      expect(component.isAdmin()).toBe(true);

      await navigate(OTHER_TEAM.teamId);
      // The service still holds the previous team, which must not be re-applied
      httpMock().expectNone(`${API}/teams/teammember?teamid=${TEAM.teamId}`);
      expect(component.team()).toEqual(TEAM);

      httpMock().expectOne(`${API}/teams?teamid=${OTHER_TEAM.teamId}`).flush(OTHER_TEAM);
      TestBed.tick();
      flushRoles(OTHER_TEAM.teamId, false, false);
      await harness.fixture.whenStable();

      expect(component.team()).toEqual(OTHER_TEAM);
      expect(component.isMember()).toBe(false);
      expect(component.isAdmin()).toBe(false);
      expect(TestBed.inject(Title).getTitle()).toBe('Counter-Strike Team: Other Team');
      expect(element().querySelector('h1').textContent).toContain('Other Team');
    });

    it('should register the discord svg icon in the browser', async () => {
      const iconService = TestBed.inject(IgxIconService);
      const addSvgIcon = vi.spyOn(iconService, 'addSvgIcon');

      await openTeam(TEAM);

      expect(addSvgIcon).toHaveBeenCalledWith('discord-full-logo', DISCORD_SVG, 'login-icons');
    });

    it('should not register the discord svg icon on the server', async () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
      const iconService = TestBed.inject(IgxIconService);
      const addSvgIcon = vi.spyOn(iconService, 'addSvgIcon');

      await openTeam(TEAM);

      expect(component.team()).toEqual(TEAM);
      expect(addSvgIcon).not.toHaveBeenCalled();
    });
  });

  describe('for a non-member', () => {
    beforeEach(async () => {
      await openTeam(TEAM, { user: USER });
    });

    it('should set the member and admin flags to false', () => {
      expect(component.isMember()).toBe(false);
      expect(component.isAdmin()).toBe(false);
    });

    it('should render the team application with the user and the team', () => {
      const application = harness.fixture.debugElement.query(By.directive(TeamApplicationComponent));
      expect(application).toBeTruthy();
      const applicationComponent = application.componentInstance as TeamApplicationComponent;
      expect(applicationComponent.team()).toEqual(TEAM);
      expect(applicationComponent.authUser()).toEqual(USER);
    });

    it('should not render the discord link', () => {
      expect(element().querySelector('a[href="https://discord.gg/test-team"]')).toBeNull();
    });

    it('should only render the public tabs', () => {
      expect(tabLabels()).toEqual(['Details', 'Competitions']);
    });
  });

  describe('for a member', () => {
    beforeEach(async () => {
      await openTeam(TEAM, { member: true });
    });

    it('should set the member flag', () => {
      expect(component.isMember()).toBe(true);
      expect(component.isAdmin()).toBe(false);
    });

    it('should not render the team application', () => {
      expect(harness.fixture.debugElement.query(By.directive(TeamApplicationComponent))).toBeNull();
    });

    it('should render the discord link', () => {
      const link: HTMLAnchorElement = element().querySelector('a[href="https://discord.gg/test-team"]');
      expect(link).toBeTruthy();
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener');
      expect(link.querySelector('igx-icon.discord-icon')).toBeTruthy();
    });

    it('should render the strategies tab but not the settings tab', () => {
      const labels = tabLabels();
      expect(labels).toContain('Strategies');
      expect(labels).not.toContain('Settings');
    });
  });

  it('should not render the discord link for a member of a team without discord', async () => {
    await openTeam({ ...TEAM, discord: '' }, { member: true });

    expect(element().querySelector('.discord-icon')).toBeNull();
    expect(harness.fixture.debugElement.query(By.directive(TeamApplicationComponent))).toBeNull();
  });

  describe('for an admin', () => {
    beforeEach(async () => {
      await openTeam(TEAM, { member: true, admin: true });
    });

    it('should set the admin flag', () => {
      expect(component.isAdmin()).toBe(true);
    });

    it('should render all tabs', () => {
      expect(tabLabels()).toEqual([
        'Details',
        'Competitions',
        'Strategies',
        'Settings'
      ]);
    });

    it('should navigate to the child route of a clicked tab and hand the team down', async () => {
      const headers = harness.fixture.debugElement.queryAll(By.css('igx-tab-header'));
      headers[3].nativeElement.click();
      await harness.fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe('/team/team-1/preferences');
      expect(element().querySelector('.team-child').textContent).toBe('Test Team');
    });
  });
});
