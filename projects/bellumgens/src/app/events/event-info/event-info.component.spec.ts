import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoComponent } from './event-info.component';
import { ApiTournamentsService } from '../../../../../common/src/public_api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;
  let apiService: ApiTournamentsService;
  let getTSpy: jasmine.Spy;
  let getSc2Spy: jasmine.Spy;
  let metaService: Meta;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventInfoComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ tournamentId: '123' }), data: new Observable<any>() } },
        Title,
        Meta,
        provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiTournamentsService);
    metaService = TestBed.inject(Meta);

    getTSpy = spyOn(apiService, "getTournament").and.returnValue(new BehaviorSubject({
      id: '123',  name: 'Test Tournament', description: 'Test Description', logo: 'test-logo'
    }));
    getSc2Spy = spyOn(apiService, "getSc2Registrations").and.returnValue(new BehaviorSubject([
      { id: '123', userId: '123', state: 0, companyId: 'company', tournamentId: '123' },
      { id: '124', userId: '124', state: 1, companyId: 'company 2', tournamentId: '123' }
    ]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tournament details on init', () => {
    expect(component.tournament.name).toBe('Test Tournament');
    expect(component.tournament.description).toBe('Test Description');
  });

  it('should call getSc2Registrations and getSc2Matches on init', () => {
    expect(getTSpy).toHaveBeenCalledWith('123');
    expect(getSc2Spy).toHaveBeenCalledWith('123');
  });

  it('should update meta tags on init', () => {
    expect(metaService.getTag('name="og:title"').content).toBe('Test Tournament');
    expect(metaService.getTag('name="og:image"').content).toBe('test-logo');
    expect(metaService.getTag('name="description"').content).toBe('Test Description');
    expect(metaService.getTag('name="twitter:title"').content).toBe('Test Tournament');
  });

  it('should refresh matches', () => {
    component.refreshMatches();
    expect(apiService.getSc2Matches).toHaveBeenCalledWith('123');
  });
});
