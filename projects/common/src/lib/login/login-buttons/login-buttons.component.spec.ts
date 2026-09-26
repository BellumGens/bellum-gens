import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginButtonsComponent } from './login-buttons.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { LOGIN_ASSETS } from '../../../models/misc';
import { LoginProvider, LoginService } from '../../../public_api';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('LoginButtonsComponent', () => {
  let component: LoginButtonsComponent;
  let fixture: ComponentFixture<LoginButtonsComponent>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        ServiceWorkerModule.register('', { enabled: false }),
        LoginButtonsComponent],
    providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

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
    const providers: LoginProvider [] = [{ name: 'Steam', state: 'test', url: 'test' }];
    expect(component.loginProviders()).toEqual([]);
    req.flush(providers);
    expect(component.loginProviders()).toEqual(providers);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(1);
  });

  it('should have loginColors', () => {
    expect(component.loginColors).toEqual(LOGIN_ASSETS);
  });

  it('should call login method with the selected provider', () => {
    const mockProvider: LoginProvider = { name: 'Steam', state: 'test', url: 'test' };
    vi.spyOn(loginService, 'login').mockImplementation(() => undefined);
    component.login(mockProvider);
    expect(loginService.login).toHaveBeenCalledWith(mockProvider);
  });
});
