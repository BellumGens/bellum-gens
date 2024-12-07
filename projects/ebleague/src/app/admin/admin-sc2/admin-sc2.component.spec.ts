import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSc2Component } from './admin-sc2.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiTournamentsService, Tournament } from 'projects/common/src/public_api';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('AdminSc2Component', () => {
  let component: AdminSc2Component;
  let fixture: ComponentFixture<AdminSc2Component>;
  let httpMock: HttpTestingController;
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
    const tounaments = [{ id: '123', active: true }, { id: '234', active: false }] as Tournament[];
    const spy = spyOn(component, 'selectTournament').and.callThrough();
    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(tounaments);
    expect(component.tournaments).toEqual(tounaments);
    expect(spy).toHaveBeenCalled();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loading).toBeTrue();
    req.flush([]);
    expect(component.loading).toBeFalse();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingRegs).toBeTrue();
    req.flush([]);
    expect(component.loadingRegs).toBeFalse();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingMatches).toBeTrue();
    req.flush([]);
    expect(component.loadingMatches).toBeFalse();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingGroups).toBeTrue();
    req.flush([]);
    expect(component.loadingGroups).toBeFalse();
  });

});
