import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('TournamentHomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        HomeComponent
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userEmail to an empty string', () => {
    expect(component.userEmail()).toBe('');
  });

  it('should have gameEnum property', () => {
    expect(component.gameEnum).toBeDefined();
  });

  it('should have registrations property', () => {
    expect(component.registrations()).toBeDefined();
  });

  it('should have authUser property', () => {
    expect(component.authUser()).toBeDefined();
  });

  it('should have openLogin method', () => {
    expect(component.openLogin).toBeDefined();
    expect(typeof component.openLogin).toBe('function');
  });

  it('should link the league format headings to the format page', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('.format-card-header h3 a') as NodeListOf<HTMLAnchorElement>);

    expect(links.map(l => l.textContent.trim())).toEqual(['Counter-Strike League', 'StarCraft II League']);
    links.forEach(l => expect(l.getAttribute('href')).toBe('/format'));
  });

  it('should clear the subscription email from a named button', async () => {
    const clear = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('form igx-suffix button');
    expect(clear()).toBeNull();

    component.userEmail.set('fan@example.com');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(clear().type).toBe('button');
    expect(clear().getAttribute('aria-label')).toBe('Clear email');

    clear().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.userEmail()).toBe('');
    expect(clear()).toBeNull();
  });
});
