import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { Router, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import {
  ApplicationUser,
  CSGOTeam,
  LoginService,
  NotificationState,
  TeamApplication,
  UserNotification
} from '../../../../common/src/public_api';
import { PlayerNotificationsComponent } from './player-notifications/player-notifications.component';
import { TeamNotificationsComponent } from './team-notifications/team-notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let httpMock: HttpTestingController;
  let reported: number [];

  const apiEndpoint = 'https://localhost:44348/api';
  const authApiEndpoint = 'https://localhost:44348/api/account';
  const team = { teamId: 'team-1', teamName: 'Admin Team', customUrl: 'admin-team' } as CSGOTeam;

  const invite = (teamId: string, state: NotificationState): UserNotification => ({
    state,
    teamInfo: { teamId, teamName: teamId, customUrl: teamId, teamAvatar: '' } as CSGOTeam,
    invitingUser: null,
    sent: '2024-01-15T10:00:00Z'
  });

  const application = (applicantId: string, state: NotificationState): TeamApplication => ({
    state,
    applicantId,
    teamId: team.teamId,
    message: '',
    userName: applicantId
  });

  const create = async () => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    reported = [];
    component.unreadChanged.subscribe(count => reported.push(count));
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const flushApplications = async (applications: TeamApplication []) => {
    httpMock.expectOne(`${apiEndpoint}/teams/applications?teamId=${team.teamId}`).flush(applications);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register('', { enabled: false }),
        NotificationsComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('without a logged in user', () => {
    beforeEach(async () => {
      await create();
      httpMock.expectOne(authApiEndpoint).flush(null);
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not load the admin teams', () => {
      expect(component.teamAdmin()).toBeUndefined();
      httpMock.expectNone(`${authApiEndpoint}/userteamsadmin`);
    });

    it('should report no unread notifications', () => {
      expect(component.unreadCount()).toBe(0);
      expect(reported.at(-1)).toBe(0);
    });
  });

  describe('with a logged in user', () => {
    beforeEach(async () => {
      const loginService = TestBed.inject(LoginService);
      loginService['_applicationUser'].set({ id: 'user-1', username: 'TestUser' } as ApplicationUser);
      // The app shell has already loaded the user notifications by the time the view is shown
      loginService['_userNotifications']
        .set([invite('a', NotificationState.NotSeen), invite('b', NotificationState.NotSeen), invite('c', NotificationState.Seen)]);
      await create();
      httpMock.expectOne(`${authApiEndpoint}/userteamsadmin`).flush([team]);
      await fixture.whenStable();
      await flushApplications([application('p1', NotificationState.NotSeen), application('p2', NotificationState.Accepted)]);
    });

    it('should report the unread player and team notifications', () => {
      expect(component.unreadCount()).toBe(3);
      expect(reported.at(-1)).toBe(3);
    });

    it('should count no unread applications for a team whose applications could not be loaded', () => {
      component.teamLoaded(team.teamId, null);

      expect(component.unreadCount()).toBe(2);
    });

    it('should count a change for a team before its applications have loaded', () => {
      // As if the team view reported a change before its applications loaded
      component['teamCounts'].set(new Map());

      component.teamChanged(team.teamId, 1);

      expect(component.unreadCount()).toBe(3);
    });

    it('should report fewer unread notifications once an invitation is accepted', async () => {
      vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const player = fixture.debugElement.query(By.directive(PlayerNotificationsComponent)).componentInstance as PlayerNotificationsComponent;

      player.acceptInvitation(player.notifications().find(n => n.teamInfo.teamId === 'a'));
      httpMock.expectOne(`${apiEndpoint}/users/acceptTeamInvite`).flush({});
      await fixture.whenStable();

      expect(component.unreadCount()).toBe(2);
      expect(reported.at(-1)).toBe(2);
    });

    it('should report fewer unread notifications once an application is handled', async () => {
      const teamView = fixture.debugElement.query(By.directive(TeamNotificationsComponent)).componentInstance as TeamNotificationsComponent;

      const pending = teamView.applications().find(a => a.applicantId === 'p1');
      teamView.rejectApplication(pending);
      httpMock.expectOne(`${apiEndpoint}/teams/rejectapplication`).flush({ ...pending, state: NotificationState.Rejected });
      await fixture.whenStable();

      expect(component.unreadCount()).toBe(2);
      expect(reported.at(-1)).toBe(2);
    });

    it('should not count the same notifications again when the view is shown again', async () => {
      vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const player = fixture.debugElement.query(By.directive(PlayerNotificationsComponent)).componentInstance as PlayerNotificationsComponent;
      player.rejectInvitation(player.notifications().find(n => n.teamInfo.teamId === 'a'));
      httpMock.expectOne(`${apiEndpoint}/users/rejectTeamInvite`).flush({});
      await fixture.whenStable();
      fixture.destroy();

      // The notifications stay cached by the LoginService, the applications are loaded again
      await create();
      await flushApplications([application('p1', NotificationState.NotSeen), application('p2', NotificationState.Accepted)]);

      expect(component.unreadCount()).toBe(2);
      expect(reported.at(-1)).toBe(2);
    });

    it('should not count the previous team applications again after logging in again', async () => {
      const loginService = TestBed.inject(LoginService);
      loginService['_applicationUser'].set(null);
      await fixture.whenStable();
      expect(component.unreadCount()).toBe(0);

      loginService['_applicationUser'].set({ id: 'user-1', username: 'TestUser' } as ApplicationUser);
      await fixture.whenStable();
      httpMock.match(`${authApiEndpoint}/userteamsadmin`).forEach(req => req.flush([team]));
      await fixture.whenStable();
      httpMock.match(`${apiEndpoint}/teams/applications?teamId=${team.teamId}`)
        .forEach(req => req.flush([application('p1', NotificationState.NotSeen), application('p2', NotificationState.Accepted)]));
      await fixture.whenStable();

      expect(component.unreadCount()).toBe(3);
      expect(reported.at(-1)).toBe(3);
    });
  });
});
