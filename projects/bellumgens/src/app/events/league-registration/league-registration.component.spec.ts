import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueRegistrationComponent } from './league-registration.component';
import {  of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiTournamentsService, CommunicationService, Game, TournamentApplication } from 'bellum-gens-common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SwPush } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LeagueRegistrationComponent', () => {
  let component: LeagueRegistrationComponent;
  let fixture: ComponentFixture<LeagueRegistrationComponent>;
  // let loginService: LoginService;
  let apiTournamentsService: ApiTournamentsService;
  let communicationService: CommunicationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LeagueRegistrationComponent,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: SwPush, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    // loginService = TestBed.inject(LoginService);
    communicationService = TestBed.inject(CommunicationService);
    apiTournamentsService = TestBed.inject(ApiTournamentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize tournamentId and tournament on init', () => {
  //   const tournament: Tournament = { id: '123', name: 'Test Tournament' } as Tournament;
  //   spyOn(apiTournamentsService, 'getTournament').and.returnValue(new BehaviorSubject(tournament));
  //   expect(component.tournamentId).toBe('123');
  //   expect(component.tournament).toEqual(tournament);
  // });

  // it('should initialize application user on init', () => {
  //   const user: ApplicationUser = { email: 'test@example.com' } as ApplicationUser;
  //   spyOn(loginService.applicationUser, 'getValue').and.returnValue(user);
  //   expect(component.authUser).toEqual(user);
  // });

  it('should handle league registration success', () => {
    const application: TournamentApplication = { id: '1', game: Game.StarCraft2, email: 'test@example.com' };
    spyOn(apiTournamentsService, 'bgeRegistration').and.returnValue(of(application));
    spyOn(communicationService, 'emitSuccess');
    component.leagueRegistration();
    expect(communicationService.emitSuccess).toHaveBeenCalledWith(`Registration successful!`);
  });
});
