import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNavComponent } from './team-nav.component';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamNewComponent } from '../team-new/team-new.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ApplicationUser, CSGOTeam, ConfirmComponent, LoginService } from '../../../../../common/src/public_api';

const TEAMS: CSGOTeam [] = [
  { teamId: 'team-1', teamName: 'First Team', teamAvatar: '', description: 'The first team', customUrl: 'first-team', visible: true },
  { teamId: 'team-2', teamName: 'Second Team', teamAvatar: '', description: 'The second team', customUrl: 'second-team', visible: true }
] as CSGOTeam [];

describe('TeamNavComponent', () => {
  let component: TeamNavComponent;
  let fixture: ComponentFixture<TeamNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamNewComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  describe('without an authenticated user', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TeamNavComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize authUser as null', () => {
      expect(component.authUser()).toBeNull();
    });

    it('should initialize teams as undefined when no user is authenticated', () => {
      expect(component.teams()).toBeUndefined();
    });

    it('should have abandonTeam method', () => {
      expect(component.abandonTeam).toBeDefined();
      expect(typeof component.abandonTeam).toBe('function');
    });

    it('should ask the user to login and not render the create button or team cards', async () => {
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('You need to login to view your teams.');
      expect(el.textContent).not.toContain('Create New Counter-Strike Team');
      expect(el.querySelectorAll('igx-card').length).toBe(0);
    });

    it('should not request user teams', async () => {
      await fixture.whenStable();
      const httpMock = TestBed.inject(HttpTestingController);
      expect(httpMock.match(req => req.url.includes('/users/userteams')).length).toBe(0);
    });
  });

  describe('with an authenticated user', () => {
    let httpMock: HttpTestingController;
    const user = { id: 'user-1', steamId: 'steam-1' } as ApplicationUser;

    const flushTeams = async (teams: CSGOTeam []) => {
      const req = httpMock.expectOne(r => r.url.includes('/users/userteams'));
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toContain('userid=user-1');
      expect(req.request.withCredentials).toBe(true);
      req.flush(teams);
      await fixture.whenStable();
    };

    beforeEach(async () => {
      httpMock = TestBed.inject(HttpTestingController);
      TestBed.inject(LoginService)['_applicationUser'].set(user);
      fixture = TestBed.createComponent(TeamNavComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should load the user teams', async () => {
      await flushTeams(TEAMS);
      expect(component.authUser()).toEqual(user);
      expect(component.teams()).toEqual(TEAMS);
    });

    it('should render the create button and a card per team', async () => {
      await flushTeams(TEAMS);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).not.toContain('You need to login to view your teams.');
      expect(el.textContent).toContain('Create New Counter-Strike Team');
      const cards = el.querySelectorAll('igx-card');
      expect(cards.length).toBe(2);
      expect(cards[0].querySelector('h3').textContent).toContain('First Team');
      expect(cards[0].textContent).toContain('The first team');
      expect(cards[1].querySelector('h3').textContent).toContain('Second Team');
    });

    it('should link each card to the team page', async () => {
      await flushTeams(TEAMS);
      const viewButtons = fixture.debugElement.queryAll(By.css('igx-card-actions button'))
        .filter(b => (b.nativeElement as HTMLElement).textContent.includes('View Team'));
      expect(viewButtons.length).toBe(2);
      const router = TestBed.inject(Router);
      const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      (viewButtons[1].nativeElement as HTMLButtonElement).click();
      expect(navigate).toHaveBeenCalled();
      expect(router.serializeUrl(navigate.mock.calls[0][0] as UrlTree)).toBe('/team/second-team');
    });

    it('should render no cards when the user has no teams', async () => {
      await flushTeams([]);
      expect(fixture.nativeElement.querySelectorAll('igx-card').length).toBe(0);
    });

    it('should open the create team dialog for the user when the create button is clicked', async () => {
      await flushTeams([]);
      const teamNew = fixture.debugElement.query(By.directive(TeamNewComponent)).componentInstance as TeamNewComponent;
      expect(teamNew.authUser()).toEqual(user);
      const open = vi.spyOn(teamNew, 'open');

      (fixture.nativeElement.querySelector('.submit-button') as HTMLButtonElement).click();
      await fixture.whenStable();

      expect(open).toHaveBeenCalled();
      const groupsReq = httpMock.expectOne(r => r.url.includes('/users/usergroups'));
      expect(groupsReq.request.url).toContain('userid=steam-1');
      groupsReq.flush([]);
      expect(teamNew.createTeam().isOpen).toBe(true);
    });

    it('should abandon a team after confirming', async () => {
      await flushTeams(TEAMS);
      const abandonButtons = fixture.debugElement.queryAll(By.css('igx-card-actions button'))
        .filter(b => (b.nativeElement as HTMLElement).textContent.includes('Abandon'));
      expect(abandonButtons.length).toBe(2);

      (abandonButtons[0].nativeElement as HTMLButtonElement).click();
      await fixture.whenStable();
      httpMock.expectNone(r => r.url.includes('/teams/abandon'));

      const confirm = fixture.debugElement.query(By.directive(ConfirmComponent)).componentInstance as ConfirmComponent;
      expect(confirm.dialog().isOpen).toBe(true);
      confirm.okClicked();
      await fixture.whenStable();

      const req = httpMock.expectOne(r => r.url.includes('/teams/abandon'));
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toContain('teamId=team-1');
      expect(req.request.withCredentials).toBe(true);
      req.flush({});
      await fixture.whenStable();

      expect(component.teams()).toEqual([TEAMS[1]]);
      const cards = fixture.nativeElement.querySelectorAll('igx-card');
      expect(cards.length).toBe(1);
      expect(cards[0].querySelector('h3').textContent).toContain('Second Team');
    });

    it('should keep the team in the list when abandoning fails', async () => {
      await flushTeams(TEAMS);
      component.abandonTeam(TEAMS[0]);
      httpMock.expectOne(r => r.url.includes('/teams/abandon'))
        .flush('error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(component.teams()).toEqual(TEAMS);
      expect(fixture.nativeElement.querySelectorAll('igx-card').length).toBe(2);
    });

    it('should not abandon a team when the confirmation is cancelled', async () => {
      await flushTeams(TEAMS);
      const confirm = fixture.debugElement.query(By.directive(ConfirmComponent)).componentInstance as ConfirmComponent;
      const abandonButton = fixture.debugElement.queryAll(By.css('igx-card-actions button'))
        .find(b => (b.nativeElement as HTMLElement).textContent.includes('Abandon'));
      (abandonButton.nativeElement as HTMLButtonElement).click();
      await fixture.whenStable();

      confirm.cancelClicked({ cancel: false } as never);
      await fixture.whenStable();
      httpMock.expectNone(r => r.url.includes('/teams/abandon'));
    });
  });
});
