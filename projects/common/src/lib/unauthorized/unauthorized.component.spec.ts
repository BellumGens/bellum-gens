import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedComponent } from './unauthorized.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let paramsSubject: Subject<any>;

  beforeEach(async () => {
    paramsSubject = new Subject();

    await TestBed.configureTestingModule({
        imports: [
            UnauthorizedComponent
        ],
        providers: [
            provideRouter([]),
            provideHttpClient(withXhr(), withInterceptorsFromDi()),
            provideHttpClientTesting(),
            {
                provide: ActivatedRoute,
                useValue: {
                    params: paramsSubject.asObservable()
                }
            }
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default message', () => {
    expect(component.message()).toBe('Unauthorized :(');
  });

  it('should update message from route params', () => {
    const customMessage = 'Access Denied';

    paramsSubject.next({ message: customMessage });
    fixture.detectChanges();

    expect(component.message()).toBe(customMessage);
    expect(fixture.nativeElement.textContent).toContain(customMessage);
  });

  it('should keep default message if no param provided', () => {
    paramsSubject.next({});
    fixture.detectChanges();

    expect(component.message()).toBe('Unauthorized :(');
  });

  it('should display message in template', () => {
    component.message.set('Test Message');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Message');
  });

  describe('actions', () => {
    const el = (): HTMLElement => fixture.nativeElement;
    const loginButton = () => Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent.includes('login'));
    const flushUser = async (user: ApplicationUser) => {
      TestBed.inject(HttpTestingController).expectOne(TestBed.inject(LoginService)['_apiEndpoint']).flush(user);
      await fixture.whenStable();
    };

    it('should explain the page and link to the home page', async () => {
      await flushUser(null);

      expect(el().querySelector('p').textContent).toContain("You don't have access to this page.");
      const home: HTMLAnchorElement = el().querySelector('a[igxButton]');
      expect(home.getAttribute('href')).toBe('/');
      expect(home.textContent).toContain('Go to the home page');
    });

    it('should open the login dialog from the login button when no user is logged in', async () => {
      await flushUser(null);
      const loginService = TestBed.inject(LoginService);
      const openLogin = vi.spyOn(loginService, 'emitOpenLogin');

      loginButton().click();

      expect(openLogin).toHaveBeenCalledTimes(1);
    });

    it('should not offer to log in for a logged in user', async () => {
      await flushUser({ id: 'user-1' } as ApplicationUser);

      expect(loginButton()).toBeUndefined();
      expect(el().querySelector('a[igxButton]')).not.toBeNull();
    });
  });
});
