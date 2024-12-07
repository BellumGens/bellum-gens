import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Router } from '@angular/router';

import { RegistrationComponent } from './registration.component';
import { LoginService } from '../../services/login.service';
import { CommunicationService } from '../../public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;
  let commsService: CommunicationService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        RegistrationComponent
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    commsService = TestBed.inject(CommunicationService);
    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const spy = spyOn(component as any, 'initUsernameCheck');
    expect(component).toBeTruthy();
    expect(component.usernameInput).toBeDefined();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should submit registration', () => {
    spyOn(router, 'navigate');
    commsService.success.subscribe(success => expect(success).toBe('User registration completed successfully!'));

    component.submitRegistration();
    expect(component.submitInProgress).toBeTrue();

    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/setpassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.userAccount);
    req.flush({});
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration error', () => {
    const errorMessage = `Http failure response for ${loginService['_apiEndpoint']}/setpassword: 500 Registration failed`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));

    component.submitRegistration();
    expect(component.submitInProgress).toBeTrue();

    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/setpassword`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.userAccount);
    req.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Registration failed' });
    expect(component.error).toBe(errorMessage);
  });

  // it('should initialize username check', () => {
  //   spyOn(fromEvent(component.usernameInput.nativeElement, 'input'), 'pipe').and.returnValue(
  //     fromEvent(component.usernameInput.nativeElement, 'input').pipe(
  //       debounceTime(300),
  //       map((event: any) => event.target.value)
  //     )
  //   );

  //   component.initUsernameCheck();

  //   expect(component.usernameInput.nativeElement).toBeDefined();
  //   expect(fromEvent(component.usernameInput.nativeElement, 'input').pipe).toHaveBeenCalled();
  // });
});
