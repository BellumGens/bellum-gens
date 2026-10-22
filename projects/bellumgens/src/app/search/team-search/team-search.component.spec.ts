import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationUser, PlaystyleRole } from '../../../../../common/src/public_api';

describe('TeamSearchComponent', () => {
  let component: TeamSearchComponent;
  let fixture: ComponentFixture<TeamSearchComponent>;
  let navigate: ReturnType<typeof vi.spyOn>;
  const el = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamSearchComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();

    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const submit = async () => {
    el().querySelector<HTMLButtonElement>('button.search-button').click();
    await fixture.whenStable();
  };

  const roleInputs = () => Array.from(el().querySelectorAll<HTMLInputElement>('#lineup input[type="radio"]'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchModel', () => {
    expect(component.searchModel()).toEqual({ role: null, scheduleOverlap: 0 });
  });

  it('should have activeLineup with 5 roles', () => {
    expect(component.activeLineup).toBeDefined();
    expect(component.activeLineup.length).toBe(5);
  });

  it('should have parseInt reference', () => {
    expect(component.parseInt).toBe(parseInt);
  });

  it('should render one role radio per lineup slot', () => {
    const radios = el().querySelectorAll('#lineup igx-radio');
    expect(Array.from(radios).map(r => r.textContent.trim()))
      .toEqual(['IGL', 'Awper', 'Entry Fragger', 'Support', 'Lurker']);
  });

  it('should not render the overlap slider without a logged in user', () => {
    expect(el().querySelector('igx-slider')).toBeNull();
  });

  it('should render the overlap slider with integer tick labels for a logged in user', async () => {
    fixture.componentRef.setInput('authUser', { id: 'user-id', username: 'TestUser' } as ApplicationUser);
    await fixture.whenStable();

    expect(el().querySelector('igx-slider')).toBeTruthy();
    const labels = Array.from(el().querySelectorAll('igx-slider .igx-ticks__label'))
      .map(l => l.textContent.trim())
      .filter(Boolean);
    expect(labels).toContain('0');
    expect(labels).toContain('40');
  });

  it('should navigate with only the overlap when no role is selected', async () => {
    await submit();

    expect(navigate).toHaveBeenCalledWith(['search/teams', 'overlap=0']);
  });

  it('should navigate with the role picked in the radio group', async () => {
    roleInputs()[3].click();
    await fixture.whenStable();
    expect(component.role()).toBe(PlaystyleRole.Support);

    await submit();

    expect(navigate).toHaveBeenCalledWith(['search/teams', `role=${PlaystyleRole.Support}&overlap=0`]);
  });

  it('should include the schedule overlap in the search query', async () => {
    fixture.componentRef.setInput('authUser', { id: 'user-id', username: 'TestUser' } as ApplicationUser);
    await fixture.whenStable();
    const thumb = el().querySelector<HTMLElement>('igx-slider igx-thumb');
    for (let i = 0; i < 5; i++) {
      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    }
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();
    expect(component.scheduleOverlap()).toBe(20);

    await submit();

    expect(navigate).toHaveBeenCalledWith(['search/teams', 'overlap=20']);
  });
});
