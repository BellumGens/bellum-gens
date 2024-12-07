import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSc2Component } from './admin-sc2.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiTournamentsService, LoginService } from 'projects/common/src/public_api';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('AdminSc2Component', () => {
  let component: AdminSc2Component;
  let fixture: ComponentFixture<AdminSc2Component>;
  let httpMock: HttpTestingController;
  let loginService: LoginService;
  let apiService: ApiTournamentsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AdminSc2Component,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tournaments', () => {
    const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
    expect(component.tournaments).toEqual([]);
  });

});
