import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNotificationsComponent } from './player-notifications.component';
import { provideRouter, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationUser, CSGOTeam, NotificationState, UserNotification } from 'bellum-gens-common';

describe('NotificationsComponent', () => {
  let component: PlayerNotificationsComponent;
  let fixture: ComponentFixture<PlayerNotificationsComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const apiEndpoint = 'https://localhost:44348/api';
  const authApiEndpoint = 'https://localhost:44348/api/account';
  const mockUser = { id: 'user-1', username: 'TestUser' } as ApplicationUser;

  const createNotifications = (): UserNotification [] => [
    {
      state: NotificationState.Accepted,
      teamInfo: { teamId: 'team-2', teamName: 'Old Team', customUrl: 'old-team', teamAvatar: 'old.png' } as CSGOTeam,
      invitingUser: null,
      sent: '2024-01-10T10:00:00Z'
    },
    {
      state: NotificationState.NotSeen,
      teamInfo: { teamId: 'team-1', teamName: 'New Team', customUrl: 'new-team', teamAvatar: 'new.png' } as CSGOTeam,
      invitingUser: null,
      sent: '2024-01-15T10:00:00Z'
    }
  ];

  const listItems = (): HTMLElement [] =>
    Array.from(fixture.nativeElement.querySelectorAll('igx-list-item:not(.igx-list__header)'));

  const itemFor = (teamName: string): HTMLElement =>
    listItems().find(item => item.textContent.includes(teamName));

  const buttonsOf = (item: HTMLElement): HTMLButtonElement [] => Array.from(item.querySelectorAll('button'));

  const logIn = async (user: ApplicationUser = mockUser) => {
    httpMock.expectOne(authApiEndpoint).flush(user);
    await fixture.whenStable();
  };

  const loadNotifications = async (notifications: UserNotification []) => {
    await logIn();
    httpMock.expectOne(`${authApiEndpoint}/usernotifications`).flush(notifications);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        ServiceWorkerModule.register('', { enabled: false }),
        PlayerNotificationsComponent],
    providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    httpMock.expectOne(authApiEndpoint).flush(null);
    expect(component).toBeTruthy();
  });

  it('should not load notifications or render anything without a logged in user', async () => {
    await logIn(null);

    httpMock.expectNone(`${authApiEndpoint}/usernotifications`);
    expect(component.authUser()).toBeNull();
    expect(component.notifications()).toBeNull();
    expect(fixture.nativeElement.querySelector('igx-list')).toBeNull();
  });

  it('should show an empty state when the user has no notifications', async () => {
    await loadNotifications([]);

    const header = fixture.nativeElement.querySelector('igx-list-item.igx-list__header') as HTMLElement;
    expect(header.textContent).toContain('Notifications for TestUser');
    expect(fixture.nativeElement.textContent).toContain('No new notifications.');
    expect(listItems().length).toBe(1);
  });

  it('should render the notifications sorted by state', async () => {
    await loadNotifications(createNotifications());

    expect(fixture.nativeElement.textContent).not.toContain('No new notifications.');
    const items = listItems();
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('You have been invited to join New Team');
    expect(items[0].textContent).toContain('Jan 15, 2024');
    expect(items[0].querySelector('a').getAttribute('href')).toBe('/team/new-team');
    expect(items[1].textContent).toContain('Old Team');
  });

  it('should show accept and reject buttons for pending invitations', async () => {
    await loadNotifications(createNotifications());

    const pending = itemFor('New Team');
    const buttons = buttonsOf(pending);
    expect(pending.classList).not.toContain('notification-disabled');
    expect(buttons.map(b => b.textContent.trim())).toEqual(['Accept', 'Reject']);
    expect(buttons.every(b => !b.disabled)).toBe(true);
  });

  it('should show the state of already handled invitations as a disabled button', async () => {
    await loadNotifications(createNotifications());

    const handled = itemFor('Old Team');
    const buttons = buttonsOf(handled);
    expect(handled.classList).toContain('notification-disabled');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('Accepted');
    expect(buttons[0].disabled).toBe(true);
  });

  it('should accept an invitation and navigate to the team', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const changed = vi.fn();
    component.changed.subscribe(changed);
    await loadNotifications(createNotifications());
    const notification = component.notifications().find(n => n.teamInfo.teamId === 'team-1');

    buttonsOf(itemFor('New Team'))[0].click();
    await fixture.whenStable();

    expect(component.actionInProgress()).toBe(true);
    expect(component.actionText()).toBe('Accepting...');
    const inProgress = buttonsOf(itemFor('New Team'));
    expect(inProgress.map(b => b.textContent.trim())).toEqual(['Accepting...', 'Accepting...']);
    expect(inProgress.every(b => b.disabled)).toBe(true);

    const req = httpMock.expectOne(`${apiEndpoint}/users/acceptTeamInvite`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(notification);
    req.flush({});
    await fixture.whenStable();

    expect(notification.state).toBe(NotificationState.Accepted);
    expect(component.pipeTrigger()).toBe(1);
    expect(component.actionInProgress()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['team', 'new-team']);
    expect(changed).toHaveBeenCalledWith(-1);

    const accepted = itemFor('New Team');
    expect(accepted.classList).toContain('notification-disabled');
    expect(buttonsOf(accepted).map(b => b.textContent.trim())).toEqual(['Accepted']);
  });

  it('should reject an invitation without navigating', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const changed = vi.fn();
    component.changed.subscribe(changed);
    await loadNotifications(createNotifications());
    const notification = component.notifications().find(n => n.teamInfo.teamId === 'team-1');

    buttonsOf(itemFor('New Team'))[1].click();
    await fixture.whenStable();

    expect(component.actionInProgress()).toBe(true);
    expect(component.actionText()).toBe('Rejecting...');
    expect(buttonsOf(itemFor('New Team')).map(b => b.textContent.trim())).toEqual(['Rejecting...', 'Rejecting...']);
    expect(buttonsOf(itemFor('New Team')).every(b => b.disabled)).toBe(true);

    const req = httpMock.expectOne(`${apiEndpoint}/users/rejectTeamInvite`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(notification);
    req.flush({});
    await fixture.whenStable();

    expect(notification.state).toBe(NotificationState.Rejected);
    expect(component.pipeTrigger()).toBe(1);
    expect(component.actionInProgress()).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(changed).toHaveBeenCalledWith(-1);

    const items = listItems();
    expect(items[0].textContent).toContain('New Team');
    expect(items[0].classList).toContain('notification-disabled');
    expect(buttonsOf(items[0]).map(b => b.textContent.trim())).toEqual(['Rejected']);
  });

  for (const [action, index, url] of [['accepting', 0, 'acceptTeamInvite'], ['rejecting', 1, 'rejectTeamInvite']] as const) {
    it(`should re-enable the buttons when ${action} an invitation fails`, async () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const changed = vi.fn();
      component.changed.subscribe(changed);
      await loadNotifications(createNotifications());
      const notification = component.notifications().find(n => n.teamInfo.teamId === 'team-1');

      buttonsOf(itemFor('New Team'))[index].click();
      await fixture.whenStable();
      expect(component.actionInProgress()).toBe(true);

      httpMock.expectOne(`${apiEndpoint}/users/${url}`).flush('error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(component.actionInProgress()).toBe(false);
      expect(notification.state).toBe(NotificationState.NotSeen);
      expect(changed).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      const buttons = buttonsOf(itemFor('New Team'));
      expect(buttons.map(b => b.textContent.trim())).toEqual(['Accept', 'Reject']);
      expect(buttons.every(b => !b.disabled)).toBe(true);
    });
  }

  it('should re-sort the list once an invitation is accepted', async () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await loadNotifications([
      createNotifications()[1],
      {
        state: NotificationState.Seen,
        teamInfo: { teamId: 'team-3', teamName: 'Third Team', customUrl: 'third-team', teamAvatar: 'third.png' } as CSGOTeam,
        invitingUser: null,
        sent: '2024-01-20T10:00:00Z'
      }
    ]);
    expect(listItems().map(i => i.querySelector('a').textContent)).toEqual(['New Team', 'Third Team']);

    buttonsOf(itemFor('New Team'))[0].click();
    httpMock.expectOne(`${apiEndpoint}/users/acceptTeamInvite`).flush({});
    await fixture.whenStable();

    expect(listItems().map(i => i.querySelector('a').textContent)).toEqual(['Third Team', 'New Team']);
  });
});
