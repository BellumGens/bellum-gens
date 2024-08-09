import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginButtonsComponent } from './login-buttons.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { LOGIN_ASSETS } from '../../../models/misc';
import { LoginProvider, LoginService } from '../../../public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginButtonsComponent', () => {
  let component: LoginButtonsComponent;
  let fixture: ComponentFixture<LoginButtonsComponent>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        LoginButtonsComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loginProviders', () => {
    const req = httpMock.expectOne(`${loginService['_apiEndpoint']}/ExternalLogins?returnUrl=%2F`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
    component.loginProviders.subscribe(providers => expect(providers).toEqual([]));
  });

  it('should have loginColors', () => {
    expect(component.loginColors).toEqual(LOGIN_ASSETS);
  });

  it('should call login method with the selected provider', () => {
    const mockProvider: LoginProvider = { name: 'Steam', state: 'test', url: 'test' };
    spyOn(loginService, 'login');
    component.login(mockProvider);
    expect(loginService.login).toHaveBeenCalledWith(mockProvider);
  });
});
