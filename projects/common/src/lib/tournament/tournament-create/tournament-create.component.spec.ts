import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Subject, of, throwError } from 'rxjs';

import { TournamentCreateComponent } from './tournament-create.component';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { TournamentVisibility, Game, GAMES, Tournament, TournamentStatus } from '../../../models/tournament';

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

  describe('from the page', () => {
    const el = (): HTMLElement => fixture.nativeElement;
    const submitButton = () => el().querySelector<HTMLButtonElement>('button[type="submit"]');

    it('creates the tournament from the submit button, showing progress while it saves', () => {
      const response = new Subject<Tournament>();
      const create = vi.spyOn(apiService, 'createTournament').mockReturnValue(response);
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const startDate = new Date(2026, 10, 1);
      const endDate = new Date(2026, 11, 1);
      component.form.patchValue({
        name: 'Winter Cup', description: 'Five on five', game: Game.CSGO, visibility: TournamentVisibility.InviteOnly,
        startDate, endDate, maxParticipants: 16, prizePool: '500 EUR'
      });
      fixture.detectChanges();
      expect(submitButton().textContent).toContain('Create Tournament');

      submitButton().click();
      fixture.detectChanges();

      expect(create).toHaveBeenCalledWith({
        id: '', name: 'Winter Cup', description: 'Five on five', game: Game.CSGO, visibility: TournamentVisibility.InviteOnly,
        startDate, endDate, maxParticipants: 16, prizePool: '500 EUR', status: TournamentStatus.Draft
      });
      expect(component.saving()).toBe(true);
      expect(submitButton().disabled).toBe(true);
      expect(submitButton().textContent).toContain('hourglass_empty');

      response.next({} as Tournament);
      fixture.detectChanges();

      expect(component.saving()).toBe(false);
      expect(navigate).toHaveBeenCalledWith(['/tournaments']);
    });

    it('sends the omitted optional fields as undefined and a missing visibility as public', () => {
      const create = vi.spyOn(apiService, 'createTournament').mockReturnValue(of({} as Tournament));
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      component.form.patchValue({ name: 'Open Cup', visibility: null });

      component.submit();

      expect(create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Open Cup', description: undefined, game: undefined, visibility: TournamentVisibility.Public,
        startDate: undefined, endDate: undefined, maxParticipants: undefined, prizePool: undefined
      }));
    });

    it('stays on the form so the tournament can be saved again when creating fails', () => {
      vi.spyOn(apiService, 'createTournament').mockReturnValue(throwError(() => new Error('nope')));
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      component.form.patchValue({ name: 'Winter Cup' });

      component.submit();
      fixture.detectChanges();

      expect(component.saving()).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
      expect(submitButton().disabled).toBe(false);
    });

    it('explains that the name is required once it was left empty', () => {
      expect(el().textContent).not.toContain('Tournament name is required');

      component.form.controls.name.markAsTouched();
      fixture.detectChanges();

      expect(el().textContent).toContain('Tournament name is required');
    });

    it('goes back to the tournaments from the back and the cancel buttons', () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const buttons = Array.from(el().querySelectorAll<HTMLButtonElement>('button[igxButton="flat"]'));
      expect(buttons.length).toBe(2);

      buttons.forEach(button => button.click());

      expect(navigate).toHaveBeenCalledTimes(2);
      expect(navigate).toHaveBeenCalledWith(['/tournaments']);
    });
  });
});

describe('TournamentCreateComponent (edit mode)', () => {
  let component: TournamentCreateComponent;
  let fixture: ComponentFixture<TournamentCreateComponent>;
  let httpMock: HttpTestingController;
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
          useValue: { params: of({ tournamentId: 't1' }) }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    apiService = TestBed.inject(ApiTournamentsService);
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

  it('defaults the fields the tournament does not have and reads its dates', async () => {
    httpMock.expectOne(r => r.url.includes('id=t1')).flush({
      id: 't1', name: 'Bare Tournament', startDate: '2026-11-01T00:00:00', endDate: '2026-12-01T00:00:00'
    });
    await fixture.whenStable();

    expect(component.form.getRawValue()).toEqual(expect.objectContaining({
      name: 'Bare Tournament', description: '', game: null, visibility: TournamentVisibility.Public,
      maxParticipants: null, prizePool: ''
    }));
    expect(component.form.value.startDate).toEqual(new Date('2026-11-01T00:00:00'));
    expect(component.form.value.endDate).toEqual(new Date('2026-12-01T00:00:00'));
  });

  it('saves the changes to the edited tournament and goes back to the tournaments', async () => {
    httpMock.expectOne(r => r.url.includes('id=t1')).flush({ id: 't1', name: 'Existing Tournament' });
    await fixture.whenStable();
    fixture.detectChanges();
    const update = vi.spyOn(apiService, 'updateTournament').mockReturnValue(of({} as Tournament));
    const create = vi.spyOn(apiService, 'createTournament');
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const submit = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Edit Tournament');
    expect(submit.textContent).toContain('Save Changes');

    submit.click();

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: 't1', name: 'Existing Tournament' }));
    expect(create).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/tournaments']);
  });

  it('stays on the form when saving the changes fails', async () => {
    httpMock.expectOne(r => r.url.includes('id=t1')).flush({ id: 't1', name: 'Existing Tournament' });
    await fixture.whenStable();
    vi.spyOn(apiService, 'updateTournament').mockReturnValue(throwError(() => new Error('nope')));
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.submit();

    expect(component.saving()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
