import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { of } from 'rxjs';

import { TournamentCreateComponent } from './tournament-create.component';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { TournamentVisibility, Game, GAMES } from '../../../models/tournament';

describe('TournamentCreateComponent', () => {
  let component: TournamentCreateComponent;
  let fixture: ComponentFixture<TournamentCreateComponent>;
  let router: Router;
  let apiService: ApiTournamentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentCreateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    apiService = TestBed.inject(ApiTournamentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.value.name).toBe('');
    expect(component.form.value.description).toBe('');
    expect(component.form.value.visibility).toBe(TournamentVisibility.Public);
  });

  it('should have games list', () => {
    expect(component.games).toEqual(GAMES);
  });

  it('should have visibility options', () => {
    expect(component.visibilityOptions.length).toBe(3);
  });

  it('should not be in edit mode by default', () => {
    expect(component.isEditMode()).toBe(false);
  });

  it('should not be saving by default', () => {
    expect(component.saving()).toBe(false);
  });

  it('should have invalid form when name is empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should have valid form when name is provided', () => {
    component.form.patchValue({ name: 'My Tournament' });
    expect(component.form.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    const spy = vi.spyOn(apiService, 'createTournament').mockImplementation(() => undefined);
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call createTournament on submit in create mode', () => {
    const spy = vi.spyOn(apiService, 'createTournament').mockReturnValue(of({} as any));
    vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.form.patchValue({ name: 'New Tournament' });
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to /tournaments after successful create', () => {
    vi.spyOn(apiService, 'createTournament').mockReturnValue(of({} as any));
    const navSpy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.form.patchValue({ name: 'New Tournament' });
    component.submit();
    expect(navSpy).toHaveBeenCalledWith(['/tournaments']);
  });

  it('should navigate to /tournaments on cancel', () => {
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    component.cancel();
    expect(spy).toHaveBeenCalledWith(['/tournaments']);
  });

  it('should associate a label with each text field', () => {
    const el: HTMLElement = fixture.nativeElement;
    const cases: [string, string][] = [
      ['name', 'Tournament Name'],
      ['description', 'Description'],
      ['maxParticipants', 'Max Participants'],
      ['prizePool', 'Prize Pool']
    ];

    for (const [control, label] of cases) {
      const field = el.querySelector<HTMLInputElement>(`[formcontrolname="${control}"]`);
      expect(field.id).not.toBe('');
      expect(field.labels.length).toBe(1);
      expect(field.labels[0].textContent.trim()).toBe(label);
    }
  });

  it('should name the back button', () => {
    const back: HTMLButtonElement = fixture.nativeElement.querySelector('.create-header button');
    expect(back.getAttribute('aria-label')).toBe('Back');
  });
});

describe('TournamentCreateComponent (edit mode)', () => {
  let component: TournamentCreateComponent;
  let fixture: ComponentFixture<TournamentCreateComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ServiceWorkerModule.register('', { enabled: false }), TournamentCreateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({ tournamentId: 't1' }) }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be in edit mode when route has tournamentId', () => {
    expect(component.isEditMode()).toBe(true);
    expect(component.tournamentId()).toBe('t1');
  });

  it('should fetch tournament and patch form in edit mode', async () => {
    const req = httpMock.expectOne(r => r.url.includes('/tournament') && r.url.includes('id=t1'));
    req.flush({
      id: 't1',
      name: 'Existing Tournament',
      description: 'A description',
      game: Game.CSGO,
      visibility: TournamentVisibility.Private
    });
    // The form is patched by an effect
    await fixture.whenStable();

    expect(component.form.value.name).toBe('Existing Tournament');
    expect(component.form.value.description).toBe('A description');
    expect(component.form.value.visibility).toBe(TournamentVisibility.Private);
  });
});
