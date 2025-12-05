import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ApplicationUser, CommunicationService, LoginService } from '../../../public_api';

import { LoginDialogComponent } from './login-dialog.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;
  let commsService: CommunicationService;
  let router: Router;
  const applicationUser: ApplicationUser = {
    id: '1',
    steamId: 'test-steam-id',
    battleNetId: 'test-battlenet-id',
    username: 'test-user',
    email: 'test-email',
    searchVisible: false,
    steamUserException: false,
    userStatsException: false,
    registered: true,
    externalLogins: [
      'Steam'
    ]
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        LoginDialogComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize logininfo with empty values', () => {
    expect(component.logininfo).toEqual({
      username: '',
      password: '',
      rememberMe: false
    })
  });

  it('should open the login dialog', () => {
    spyOn(component.dialog, 'open');
    component.openLogin();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open the registration dialog', () => {
    spyOn(component.dialog, 'close');
    spyOn(router, 'navigate');
    component.openRegistration();
    expect(component.dialog.close).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it('should perform login with form data', () => {
    spyOn(component.dialog, 'close');
    // Set form data
    component.logininfo.username = 'testuser';
    component.logininfo.password = 'testpassword';

    commsService.success.subscribe(message => expect(message).toEqual('Logged in successfully!'));
    // Call the loginWithForm method
    component.loginWithForm();
    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.logininfo);
    expect(req.request.withCredentials).toBe(true);
    expect(component.submitInProgress).toBe(true);
    req.flush(applicationUser);
    expect(component.submitInProgress).toBe(false);
    expect(component.dialog.close).toHaveBeenCalled();
    expect(loginService['_applicationUser'].value).toEqual(applicationUser);

    const req2 = httpMock.expectOne(`${loginService['_apiBase']}/tournament/registrations`);
    expect(req2.request.method).toBe('GET');
    expect(req2.request.withCredentials).toBe(true);
    req2.flush([]);
    expect(loginService['_registrations'].value).toEqual([]);
  });

  it('should show error message when login fails with backend error', () => {
    spyOn(component.dialog, 'close');
    const errorMessage = 'Invalid username or password';
    let errorEmitted = false;

    // Set form data
    component.logininfo.username = 'testuser';
    component.logininfo.password = 'wrongpassword';

    // Subscribe to error emissions
    commsService.error.subscribe(message => {
      expect(message).toEqual(errorMessage);
      errorEmitted = true;
    });

    // Call the loginWithForm method
    component.loginWithForm();
    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/login`);
    expect(req.request.method).toBe('POST');
    expect(component.submitInProgress).toBe(true);

    // Flush with error response
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });

    expect(component.submitInProgress).toBe(false);
    expect(component.dialog.close).not.toHaveBeenCalled();
    expect(errorEmitted).toBe(true);
  });

  it('should show default error message when login fails without specific backend error', () => {
    spyOn(component.dialog, 'close');
    let errorEmitted = false;

    // Set form data
    component.logininfo.username = 'testuser';
    component.logininfo.password = 'wrongpassword';

    // Subscribe to error emissions
    commsService.error.subscribe(message => {
      expect(message).toEqual('Login failed. Please check your credentials and try again.');
      errorEmitted = true;
    });

    // Call the loginWithForm method
    component.loginWithForm();
    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/login`);
    expect(req.request.method).toBe('POST');
    expect(component.submitInProgress).toBe(true);

    // Flush with error response without error body
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(component.submitInProgress).toBe(false);
    expect(component.dialog.close).not.toHaveBeenCalled();
    expect(errorEmitted).toBe(true);
  });

  it('should show error message when login fails with network error', fakeAsync(() => {
    spyOn(component.dialog, 'close');
    let errorEmitted = false;
    let capturedMessage = '';

    // Set form data
    component.logininfo.username = 'testuser';
    component.logininfo.password = 'testpassword';

    // Subscribe to error emissions
    commsService.error.subscribe(message => {
      capturedMessage = message;
      errorEmitted = true;
    });

    // Call the loginWithForm method
    component.loginWithForm();
    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/login`);
    expect(req.request.method).toBe('POST');
    expect(component.submitInProgress).toBe(true);

    // Simulate network error
    req.error(new ProgressEvent('error'));
    tick(); // Flush all async operations

    expect(component.submitInProgress).toBe(false);
    expect(component.dialog.close).not.toHaveBeenCalled();
    expect(errorEmitted).toBe(true);
    expect(capturedMessage).toEqual('Login failed. Please check your credentials and try again.');
  }));
});
