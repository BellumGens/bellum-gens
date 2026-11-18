import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessComponent } from './registration-success.component';
import { Navigation, provideRouter, Router } from '@angular/router';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        RegistrationSuccessComponent
        ],
    providers: [provideRouter([])]
})
    .compileComponents();
  });

  const createComponent = (state?: Record<string, unknown>) => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'currentNavigation').mockReturnValue(
      (state ? { extras: { state } } : null) as unknown as Navigation
    );
    fixture = TestBed.createComponent(RegistrationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render the registration details passed through the navigation state', () => {
    createComponent({ hash: 'ABC123', email: 'player@example.com' });
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(component.application?.hash).toBe('ABC123');
    expect(text).toContain('ABC123');
    expect(text).toContain('player@example.com');
    expect((fixture.nativeElement as HTMLElement).querySelector('a[href="/"]')).toBeNull();
  });

  it('should quote the fees of the StarCraft II and Counter-Strike leagues', () => {
    createComponent({ hash: 'ABC123', game: 0 });
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('300 BGN for the Counter-Strike league');
  });

  it('should not quote a fee for a Dota 2 registration', () => {
    createComponent({ hash: 'ABC123', game: 2 });
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('you need to pay the registration fee.');
    expect(text).not.toContain('BGN for');
  });

  it('should not render empty placeholders when opened without registration data', () => {
    createComponent();
    const el = fixture.nativeElement as HTMLElement;
    expect(component.application).toBeNull();
    expect(el.textContent).not.toContain('bank transfer details');
    expect(el.textContent).not.toContain('()');
    expect(el.textContent).toContain('There are no registration details to show.');
    expect(el.querySelector('a[href="/"]')).toBeTruthy();
  });

  it('should treat a navigation state without a registration code as missing data', () => {
    createComponent({ navigationId: 1 });
    expect(component.application).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('There are no registration details to show.');
  });
});
