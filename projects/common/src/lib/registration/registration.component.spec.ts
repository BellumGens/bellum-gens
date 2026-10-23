import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Router } from '@angular/router';

import { RegistrationComponent } from './registration.component';
import { LoginService } from '../../services/login.service';
import { CommunicationService } from '../../public_api';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;
  let commsService: CommunicationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        RegistrationComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    commsService = TestBed.inject(CommunicationService);
    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const spy = vi.spyOn(component as any, 'initUsernameCheck').mockImplementation(() => undefined);
    expect(component).toBeTruthy();
    expect(component.usernameInput()).toBeDefined();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should ask the user to set up their account', () => {
    expect(fixture.nativeElement.querySelector('h4').textContent.trim()).toBe('Set up your account');
  });

  it('should submit registration', () => {
    vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    commsService.success.subscribe(success => expect(success).toBe('User registration completed successfully!'));

    component.submitRegistration();
    expect(component.submitInProgress()).toBe(true);

    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/setpassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.userAccount());
    req.flush({});
    expect(component.submitInProgress()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration error', () => {
    const errorMessage = `Http failure response for ${loginService['_apiEndpoint']}/setpassword: 500 Registration failed`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));

    component.submitRegistration();
    expect(component.submitInProgress()).toBe(true);

    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/setpassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.userAccount());
    req.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Registration failed' });
    expect(component.error()).toBe(errorMessage);
    expect(component.submitInProgress()).toBe(false);
  });

  it('should update the user account from the form fields', () => {
    component.updateAccount('username', 'new-user');
    component.updateAccount('email', 'new@user.com');
    expect(component.userAccount()).toEqual({ username: 'new-user', password: '', confirmPassword: '', email: 'new@user.com' });
  });

  it('should update the user account from the template inputs', () => {
    const fields = { regusername: 'typed-user', email: 'typed@user.com', password: 'Passw0rd!', confirmPassword: 'Passw0rd!' };
    for (const [id, value] of Object.entries(fields)) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(`#${id}`);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    expect(component.userAccount()).toEqual({
      username: 'typed-user',
      email: 'typed@user.com',
      password: 'Passw0rd!',
      confirmPassword: 'Passw0rd!'
    });
  });

  it('should populate the account from the authenticated user', () => {
    httpMock.expectOne(`${loginService['_apiEndpoint']}`).flush({ username: 'auth-user', email: 'auth@user.com' });
    TestBed.tick();
    expect(component.userAccount()).toEqual({ username: 'auth-user', password: '', confirmPassword: '', email: 'auth@user.com' });
  });

  it('should not populate the account from an authenticated user without an email', () => {
    httpMock.expectOne(`${loginService['_apiEndpoint']}`).flush({ username: 'auth-user', email: null });
    TestBed.tick();
    expect(component.userAccount()).toEqual({ username: '', password: '', confirmPassword: '', email: '' });
  });

  it('should render the registration error', async () => {
    component.error.set('Registration failed');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.error-hint').textContent.trim()).toBe('Registration failed');
  });

  describe('filling in the form', () => {
    const el = (): HTMLElement => fixture.nativeElement;
    const registerButton = () => el().querySelector<HTMLButtonElement>('button.submit-button');
    const type = async (fields: Record<string, string>) => {
      for (const [id, value] of Object.entries(fields)) {
        const input = el().querySelector<HTMLInputElement>(`#${id}`);
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
      }
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const valid = { regusername: 'new-user', email: 'new@user.com', password: 'Passw0rd!', confirmPassword: 'Passw0rd!' };

    it('keeps the register button disabled until the form was touched', () => {
      expect(registerButton().disabled).toBe(true);
    });

    it('explains the password rules once a weak password was left', async () => {
      expect(el().textContent).not.toContain('Must 8 or more characters');

      await type({ password: 'weak' });

      expect(el().textContent).toContain('Must 8 or more characters');
      expect(registerButton().disabled).toBe(true);
    });

    it('flags a confirmation that does not match the password', async () => {
      await type({ password: 'Passw0rd!', confirmPassword: 'Passw0rd?' });

      expect(el().textContent).toContain('Doesn\'t match...');

      await type({ confirmPassword: 'Passw0rd!' });

      expect(el().textContent).not.toContain('Doesn\'t match...');
    });

    it('registers a complete account from the register button, disabled while it submits', async () => {
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      await type(valid);
      expect(registerButton().disabled).toBe(false);

      registerButton().click();
      fixture.detectChanges();

      expect(registerButton().disabled).toBe(true);
      const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/setpassword`);
      expect(req.request.body).toEqual({ username: 'new-user', email: 'new@user.com', password: 'Passw0rd!', confirmPassword: 'Passw0rd!' });
      req.flush({});

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('username check', () => {
    const typeUsername = (value: string) => {
      const input = component.usernameInput().nativeElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keyup'));
    };

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should flag a username that is already taken', async () => {
      typeUsername('taken');
      vi.advanceTimersByTime(300);

      httpMock.expectOne(`${loginService['_apiEndpoint']}/username?username=taken`).flush(true);
      expect(component.inUse()).toBe(true);

      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('igx-hint.color-error').textContent).toContain('Username already taken');
    });

    it('should clear the flag for an available username', () => {
      component.inUse.set(true);
      typeUsername('available');
      vi.advanceTimersByTime(300);

      httpMock.expectOne(`${loginService['_apiEndpoint']}/username?username=available`).flush(false);
      expect(component.inUse()).toBe(false);
    });

    it('should debounce keystrokes and only check the latest value', () => {
      typeUsername('a');
      vi.advanceTimersByTime(100);
      typeUsername('ab');
      vi.advanceTimersByTime(299);
      httpMock.expectNone(req => req.url.includes('/username'));

      vi.advanceTimersByTime(1);
      httpMock.expectOne(`${loginService['_apiEndpoint']}/username?username=ab`).flush(false);
    });

    it('should ignore the result when the username belongs to the authenticated user', () => {
      httpMock.expectOne(`${loginService['_apiEndpoint']}`).flush({ username: 'auth-user', email: 'auth@user.com' });
      TestBed.tick();

      typeUsername('auth-user');
      vi.advanceTimersByTime(300);

      httpMock.expectOne(`${loginService['_apiEndpoint']}/username?username=auth-user`).flush(true);
      expect(component.inUse()).toBe(false);
    });
  });
});
