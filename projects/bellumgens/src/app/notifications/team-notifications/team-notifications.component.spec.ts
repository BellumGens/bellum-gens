import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNotificationsComponent } from './team-notifications.component';
import { provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { CSGOTeam, NotificationState, TeamApplication } from 'bellum-gens-common';

describe('TeamNotificationsComponent', () => {
  let component: TeamNotificationsComponent;
  let fixture: ComponentFixture<TeamNotificationsComponent>;
  let httpMock: HttpTestingController;

  const apiEndpoint = 'https://localhost:44348/api';
  const mockTeam = { teamId: 'team-1', teamName: 'Test Team', customUrl: 'test-team' } as CSGOTeam;

  const createApplications = (): TeamApplication [] => [
    {
      state: NotificationState.NotSeen,
      applicantId: 'player-1',
      teamId: 'team-1',
      message: 'Let me in',
      sent: '2024-01-15T10:00:00Z',
      userName: 'PlayerOne',
      avatarIcon: 'avatar-1.png'
    },
    {
      state: NotificationState.Accepted,
      applicantId: 'player-2',
      teamId: 'team-1',
      message: 'Me too',
      sent: '2024-01-16T10:00:00Z',
      userName: 'PlayerTwo',
      avatarIcon: 'avatar-2.png'
    }
  ];

  const listItems = (): HTMLElement [] =>
    Array.from(fixture.nativeElement.querySelectorAll('igx-list-item:not(.igx-list__header)'));

  const itemFor = (userName: string): HTMLElement =>
    listItems().find(item => item.textContent.includes(userName));

  const buttonsOf = (item: HTMLElement): HTMLButtonElement [] => Array.from(item.querySelectorAll('button'));

  const loadApplications = async (applications: TeamApplication []) => {
    fixture.componentRef.setInput('team', mockTeam);
    fixture.detectChanges();
    httpMock.expectOne(`${apiEndpoint}/teams/applications?teamId=${mockTeam.teamId}`).flush(applications);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TeamNotificationsComponent],
    providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNotificationsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not request applications or render anything without a team', () => {
    fixture.detectChanges();

    httpMock.expectNone(req => req.url.includes('/teams/applications'));
    expect(component.applications()).toBeNull();
    expect(fixture.nativeElement.querySelector('igx-list')).toBeNull();
  });

  it('should load the team applications and emit them', async () => {
    const loaded = vi.fn();
    component.loaded.subscribe(loaded);
    const applications = createApplications();

    await loadApplications(applications);

    expect(component.applications()).toEqual(applications);
    expect(loaded).toHaveBeenCalledWith(applications);
  });

  it('should not render the list when the team has no applications', async () => {
    await loadApplications([]);

    expect(fixture.nativeElement.querySelector('igx-list')).toBeNull();
  });

  it('should render a header and an item per application', async () => {
    await loadApplications(createApplications());

    const header = fixture.nativeElement.querySelector('igx-list-item.igx-list__header') as HTMLElement;
    expect(header.textContent).toContain('Notifications for Test Team');
    expect(listItems().length).toBe(2);

    const pending = itemFor('PlayerOne');
    expect(pending.textContent).toContain('has applied to join your team!');
    expect(pending.textContent).toContain('Application: Let me in');
    expect(pending.textContent).toContain('Jan 15, 2024');
    expect(pending.querySelector('a').getAttribute('href')).toBe('/players/player-1');
  });

  it('should show approve and reject buttons for pending applications', async () => {
    await loadApplications(createApplications());

    const pending = itemFor('PlayerOne');
    const buttons = buttonsOf(pending);
    expect(pending.classList).not.toContain('notification-disabled');
    expect(buttons.map(b => b.textContent.trim())).toEqual(['Approve', 'Reject']);
    expect(buttons.every(b => !b.disabled)).toBe(true);
  });

  it('should show the state of already handled applications as a disabled button', async () => {
    await loadApplications(createApplications());

    const handled = itemFor('PlayerTwo');
    const buttons = buttonsOf(handled);
    expect(handled.classList).toContain('notification-disabled');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('Accepted');
    expect(buttons[0].disabled).toBe(true);
  });

  it('should navigate to the applicant profile when the name is clicked', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    await loadApplications(createApplications());

    itemFor('PlayerOne').querySelector('a').click();

    expect(navigateSpy).toHaveBeenCalled();
    expect(router.serializeUrl(navigateSpy.mock.calls[0][0] as never)).toBe('/players/player-1');
  });

  it('should approve an application when the approve button is clicked', async () => {
    const changed = vi.fn();
    component.changed.subscribe(changed);
    await loadApplications(createApplications());

    buttonsOf(itemFor('PlayerOne'))[0].click();
    await fixture.whenStable();

    expect(component.actionInProgress()).toBe(true);
    expect(component.actionText()).toBe('Approving...');
    const inProgress = buttonsOf(itemFor('PlayerOne'));
    expect(inProgress.map(b => b.textContent.trim())).toEqual(['Approving...', 'Approving...']);
    expect(inProgress.every(b => b.disabled)).toBe(true);

    const req = httpMock.expectOne(`${apiEndpoint}/teams/approveapplication`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.applicantId).toBe('player-1');
    req.flush({ ...req.request.body, state: NotificationState.Accepted });
    await fixture.whenStable();

    expect(component.actionInProgress()).toBe(false);
    expect(changed).toHaveBeenCalledWith(-1);
    expect(component.applications().find(a => a.applicantId === 'player-1').state).toBe(NotificationState.Accepted);

    const approved = itemFor('PlayerOne');
    expect(approved.classList).toContain('notification-disabled');
    expect(buttonsOf(approved).map(b => b.textContent.trim())).toEqual(['Accepted']);
  });

  it('should reject an application when the reject button is clicked', async () => {
    const changed = vi.fn();
    component.changed.subscribe(changed);
    await loadApplications(createApplications());

    buttonsOf(itemFor('PlayerOne'))[1].click();
    await fixture.whenStable();

    expect(component.actionInProgress()).toBe(true);
    expect(component.actionText()).toBe('Rejecting...');
    expect(buttonsOf(itemFor('PlayerOne')).map(b => b.textContent.trim())).toEqual(['Rejecting...', 'Rejecting...']);

    const req = httpMock.expectOne(`${apiEndpoint}/teams/rejectapplication`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.applicantId).toBe('player-1');
    req.flush({ ...req.request.body, state: NotificationState.Rejected });
    await fixture.whenStable();

    expect(component.actionInProgress()).toBe(false);
    expect(changed).toHaveBeenCalledWith(-1);

    const rejected = itemFor('PlayerOne');
    expect(rejected.classList).toContain('notification-disabled');
    expect(buttonsOf(rejected).map(b => b.textContent.trim())).toEqual(['Rejected']);
  });

  it('should only replace the handled application', async () => {
    const applications = createApplications();
    await loadApplications(applications);
    const untouched = component.applications().find(a => a.applicantId === 'player-2');

    component.approveApplication(component.applications().find(a => a.applicantId === 'player-1'));
    httpMock.expectOne(`${apiEndpoint}/teams/approveapplication`)
      .flush({ ...applications[0], state: NotificationState.Accepted });

    expect(component.applications().find(a => a.applicantId === 'player-2')).toBe(untouched);
  });
});
