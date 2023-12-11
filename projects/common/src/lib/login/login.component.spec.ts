import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationUser, LoginService } from '../../public_api';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let authService: LoginService;
  let applicationUser: ApplicationUser = {
    id: '1',
    steamId: 'test-steam-id',
    battleNetId: 'test-battlenet-id',
    username: 'test-user',
    email: 'test-email',
    avatarFull: 'test-avatar',
    avatarMedium: 'test-avatar',
    avatarIcon: 'test-avatar',
    customURL: 'test-url',
    realname: 'test-realname',
    searchVisible: true,
    externalLogins: []
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        LoginComponent
      ]
    })
    .compileComponents();
    authService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a dialog component which opens when the LoginService emits openLogin', () => {
    expect(component.dialog).toBeDefined();
    spyOn(component.dialog, 'openLogin');
    authService.emitOpenLogin();
    expect(component.dialog.openLogin).toHaveBeenCalled();
  });

  it('should have a userProfile component after authUser is set', () => {
    expect(component.userProfile).toBeUndefined();
    authService.applicationUser.subscribe();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    req.flush(applicationUser);
    expect(component.authUser).toBe(applicationUser);
    fixture.detectChanges();
    expect(component.userProfile).toBeDefined();
  });

  it('should have userCheck when a request in currently pending', () => {
    authService.applicationUser.subscribe();
    const req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    expect(component.userCheck).toBeTrue();
    req.flush(applicationUser);
    expect(component.userCheck).toBeFalse();
    expect(component.authUser).toBe(applicationUser);
  });

  it('should call logout method', () => {
    authService.applicationUser.subscribe();
    let req = httpMock.expectOne(`${authService['_apiEndpoint']}`);
    req.flush(applicationUser);
    component.authUser = applicationUser;
    fixture.detectChanges();

    spyOn(component.userProfile, 'close');
    component.logout();
    req = httpMock.expectOne(`${authService['_apiEndpoint']}/logout`);
    req.flush({});
    expect(component.userProfile.close).toHaveBeenCalled();
    expect(component.authUser).toBeNull();
  });

  it('navigateToProfile method should call router.navigate with correct params', () => {
    const id = '123';
    spyOn(router, 'navigate');
    component.navigateToProfile(id);
    expect(router.navigate).toHaveBeenCalledWith(['/players/', id]);
  });
});
