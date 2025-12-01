import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { EliteStz2026Component } from './elite-stz-2026.component';
import { ApplicationUser, BellumgensApiService, CommunicationService, LoginService } from '../../../../common/src/public_api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EliteStz2026Component', () => {
  let component: EliteStz2026Component;
  let fixture: ComponentFixture<EliteStz2026Component>;
  let mockApiService: jasmine.SpyObj<BellumgensApiService>;
  let mockCommService: jasmine.SpyObj<CommunicationService>;
  let mockAuthService: jasmine.SpyObj<LoginService>;
  let authUserSubject: BehaviorSubject<ApplicationUser | null>;

  beforeEach(async () => {
    authUserSubject = new BehaviorSubject<ApplicationUser | null>(null);
    mockApiService = jasmine.createSpyObj('BellumgensApiService', ['getSignupCount', 'earlyBirdSignup']);
    mockCommService = jasmine.createSpyObj('CommunicationService', ['emitError']);
    mockAuthService = jasmine.createSpyObj('LoginService', [], { applicationUser: authUserSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [EliteStz2026Component, NoopAnimationsModule],
      providers: [
        { provide: BellumgensApiService, useValue: mockApiService },
        { provide: CommunicationService, useValue: mockCommService },
        { provide: LoginService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EliteStz2026Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with disabled form controls', () => {
    expect(component.form.get('email')?.disabled).toBe(true);
    expect(component.form.get('firstTime')?.disabled).toBe(true);
    expect(component.form.get('agreePrivacy')?.disabled).toBe(true);
  });

  it('should enable form controls when user logs in', () => {
    const user: ApplicationUser = { email: 'test@example.com', id: '123', username: 'testuser' } as ApplicationUser;
    authUserSubject.next(user);

    expect(component.form.get('email')?.disabled).toBe(false);
    expect(component.form.get('firstTime')?.disabled).toBe(false);
    expect(component.form.get('agreePrivacy')?.disabled).toBe(false);
    expect(component.form.get('email')?.value).toBe('test@example.com');
  });

  it('should fetch signup count on init in browser', () => {
    mockApiService.getSignupCount.and.returnValue(of(42));
    fixture.detectChanges();

    expect(mockApiService.getSignupCount).toHaveBeenCalled();
    expect(component.count()).toBe(42);
  });

  it('should set count to 0 on error', () => {
    mockApiService.getSignupCount.and.returnValue(throwError(() => new Error('error')));
    fixture.detectChanges();

    expect(component.count()).toBe(0);
  });

  describe('discount calculation', () => {
    it('should return 10% for count between 1-100', () => {
      component.count.set(50);
      expect(component.discount).toBe(10);
    });

    it('should return 15% for count between 101-250', () => {
      component.count.set(150);
      expect(component.discount).toBe(15);
    });

    it('should return 25% for count between 251-500', () => {
      component.count.set(300);
      expect(component.discount).toBe(25);
    });

    it('should return 33% for count above 500', () => {
      component.count.set(600);
      expect(component.discount).toBe(33);
    });

    it('should return 0% for count of 0', () => {
      component.count.set(0);
      expect(component.discount).toBe(0);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      const user: ApplicationUser = { email: 'test@example.com', id: '123', username: 'testuser' } as ApplicationUser;
      authUserSubject.next(user);
      component.form.patchValue({ email: 'test@example.com', firstTime: true, agreePrivacy: true });
    });

    it('should not submit if form is invalid', () => {
      component.form.get('agreePrivacy')?.setValue(false);
      component.submit();

      expect(mockApiService.earlyBirdSignup).not.toHaveBeenCalled();
    });

    it('should not submit if user is not authenticated', () => {
      component.authUser = null;
      component.submit();

      expect(mockApiService.earlyBirdSignup).not.toHaveBeenCalled();
    });

    it('should submit successfully and update count', () => {
      mockApiService.earlyBirdSignup.and.returnValue(of(undefined));
      mockApiService.getSignupCount.and.returnValue(of(43));

      component.submit();

      expect(component.submitting()).toBe(false);
      expect(mockApiService.earlyBirdSignup).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstTime: true
      });
      expect(component.count()).toBe(43);
    });

    it('should handle submission error', () => {
      const error = { message: 'Submission failed' };
      mockApiService.earlyBirdSignup.and.returnValue(throwError(() => error));

      component.submit();

      expect(component.submitting()).toBe(false);
      expect(mockCommService.emitError).toHaveBeenCalledWith('Submission failed');
    });

    it('should use default error message if none provided', () => {
      mockApiService.earlyBirdSignup.and.returnValue(throwError(() => ({})));

      component.submit();

      expect(mockCommService.emitError).toHaveBeenCalledWith(
        'An error occurred while submitting your pre-registration. Please try again later.'
      );
    });
  });
});
