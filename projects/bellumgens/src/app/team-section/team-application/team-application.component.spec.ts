import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamApplicationComponent } from './team-application.component';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import {
  ApplicationUser,
  CSGOTeam,
  CommunicationService,
  NotificationState,
  TeamApplication
} from '../../../../../common/src/public_api';

const USER = { id: 'user-1', steamId: 'steam-1', username: 'Applicant' } as ApplicationUser;
const TEAM = { teamId: 'team-1', teamName: 'Test Team', customUrl: 'test-team', visible: true } as CSGOTeam;

describe('TeamApplicationComponent', () => {
  let component: TeamApplicationComponent;
  let fixture: ComponentFixture<TeamApplicationComponent>;
  let httpMock: HttpTestingController;

  const applyButton = () => fixture.nativeElement.querySelector(':scope > button') as HTMLButtonElement;
  const dialogButton = (label: string) => fixture.debugElement.queryAll(By.css('.igx-dialog__window-actions button'))
    .find(b => (b.nativeElement as HTMLElement).textContent.includes(label)).nativeElement as HTMLButtonElement;
  const textarea = () => fixture.nativeElement.querySelector('textarea[name="motivation"]') as HTMLTextAreaElement;
  const clearIcon = () => fixture.nativeElement.querySelector('igx-suffix') as HTMLElement;

  const typeMessage = async (message: string) => {
    const el = textarea();
    el.value = message;
    el.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        TeamApplicationComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('without an authenticated user', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TeamApplicationComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('team', TEAM);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize an empty application', () => {
      expect(component.application).toEqual({
        teamId: '',
        applicantId: '',
        state: NotificationState.NotSeen,
        message: ''
      });
    });

    it('should render a disabled apply button', () => {
      const button = applyButton();
      expect(button.textContent).toContain('Apply to join');
      expect(button.disabled).toBe(true);
    });

    it('should keep the dialog closed', () => {
      expect(component.dialog().isOpen).toBe(false);
    });

    it('should not submit an application', async () => {
      component.dialog().open();
      await fixture.whenStable();
      await typeMessage('Let me in');

      dialogButton('Submit Application').click();
      await fixture.whenStable();

      httpMock.expectNone(r => r.url.includes('/teams/apply'));
      expect(component.dialog().isOpen).toBe(true);
    });
  });

  describe('with an authenticated user', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TeamApplicationComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('authUser', USER);
      fixture.componentRef.setInput('team', TEAM);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const openDialog = async () => {
      applyButton().click();
      await fixture.whenStable();
    };

    it('should render an enabled apply button', () => {
      expect(applyButton().disabled).toBe(false);
    });

    it('should open the application dialog when apply is clicked', async () => {
      await openDialog();
      expect(component.dialog().isOpen).toBe(true);
      const title = fixture.nativeElement.querySelector('.igx-dialog__window-title') as HTMLElement;
      expect(title.textContent).toContain('Why do you want to join our team?');
      expect(dialogButton('Cancel')).toBeTruthy();
      expect(dialogButton('Submit Application')).toBeTruthy();
    });

    it('should close the dialog without submitting when cancel is clicked', async () => {
      await openDialog();
      dialogButton('Cancel').click();
      await fixture.whenStable();

      await vi.waitFor(() => expect(component.dialog().isOpen).toBe(false));
      httpMock.expectNone(r => r.url.includes('/teams/apply'));
    });

    it('should bind the motivation message to the application', async () => {
      await openDialog();
      expect(clearIcon()).toBeNull();

      await typeMessage('I am a great AWPer');

      expect(component.application.message).toBe('I am a great AWPer');
      expect(clearIcon()).not.toBeNull();
    });

    it('should clear the message when the clear icon is clicked', async () => {
      await openDialog();
      await typeMessage('I am a great AWPer');

      clearIcon().click();
      await fixture.whenStable();

      expect(component.application.message).toBe('');
      expect(clearIcon()).toBeNull();
      expect(textarea().value).toBe('');
    });

    it('should submit the application and close the dialog on success', async () => {
      const success = vi.spyOn(TestBed.inject(CommunicationService), 'emitSuccess');
      await openDialog();
      await typeMessage('I am a great AWPer');

      dialogButton('Submit Application').click();
      await fixture.whenStable();

      const req = httpMock.expectOne(r => r.url.endsWith('/teams/apply'));
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.body).toEqual({
        teamId: 'team-1',
        applicantId: 'user-1',
        state: NotificationState.NotSeen,
        message: 'I am a great AWPer'
      } as TeamApplication);
      expect(component.dialog().isOpen).toBe(true);

      req.flush({});
      await fixture.whenStable();

      expect(success).toHaveBeenCalledWith('Application submitted successfully!');
      await vi.waitFor(() => expect(component.dialog().isOpen).toBe(false));
    });

    it('should report a failed submission and keep the dialog open', async () => {
      const error = vi.spyOn(TestBed.inject(CommunicationService), 'emitError');
      await openDialog();
      await typeMessage('I am a great AWPer');

      dialogButton('Submit Application').click();
      await fixture.whenStable();

      httpMock.expectOne(r => r.url.endsWith('/teams/apply'))
        .flush('error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(error).toHaveBeenCalled();
      expect(component.dialog().isOpen).toBe(true);
      expect(component.application.message).toBe('I am a great AWPer');
    });

    it('should not submit an application without a team', async () => {
      fixture.componentRef.setInput('team', undefined);
      await openDialog();
      await typeMessage('I am a great AWPer');

      expect(() => component.submitApplication()).not.toThrow();
      httpMock.expectNone(r => r.url.includes('/teams/apply'));
    });

    it('should not mutate the component application when submitting', async () => {
      await openDialog();
      await typeMessage('Hello');
      dialogButton('Submit Application').click();
      await fixture.whenStable();

      httpMock.expectOne(r => r.url.endsWith('/teams/apply')).flush({});
      expect(component.application.teamId).toBe('');
      expect(component.application.applicantId).toBe('');
    });
  });
});
