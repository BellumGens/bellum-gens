import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxCarouselComponent } from '@infragistics/igniteui-angular/carousel';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationUser, LoginService, SocialMediaService } from '../../../../common/src/public_api';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        
        ServiceWorkerModule.register('', { enabled: false }),
        HomeComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a carousel component', () => {
    const carousel = fixture.debugElement.query(By.directive(IgxCarouselComponent));
    expect(carousel).toBeTruthy();
  });

  it('should call resize method on window resize', () => {
    vi.spyOn(component, 'resize').mockImplementation(() => undefined);
    window.dispatchEvent(new Event('resize'));
    expect(component.resize).toHaveBeenCalled();
  });

  it('should subscribe the typed email to the newsletter', async () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const email = fixture.nativeElement.querySelector('#subemail') as HTMLInputElement;
    const submit = fixture.nativeElement.querySelector('.submit-email') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    email.value = 'fan@example.com';
    email.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(submit.disabled).toBe(false);
    submit.click();

    const req = httpMock.expectOne(r => r.url.endsWith('/account/subscribe'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'fan@example.com' });
    req.flush({});
  });

  it('should not subscribe without an email', () => {
    const httpMock = TestBed.inject(HttpTestingController);

    component.subscribe();
    component.userEmail.set('');
    component.subscribe();

    httpMock.expectNone(r => r.url.endsWith('/account/subscribe'));
  });

  it('should tweet at Bellum Gens', () => {
    const tweet = vi.spyOn(TestBed.inject(SocialMediaService), 'tweetWithText').mockImplementation(() => undefined);

    const button = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
      .find(b => b.getAttribute('class')?.includes('space-out-button'));
    button.click();

    expect(tweet).toHaveBeenCalledWith('Hey @BellumGens ...');
  });

  it('should initialize navigation property', () => {
    expect(component.navigation()).toBeDefined();
    expect(typeof component.navigation()).toBe('boolean');
  });

  it('should initialize userEmail to null', () => {
    expect(component.userEmail()).toBeNull();
  });

  it('should have environment property', () => {
    expect(component.environment).toBeDefined();
  });

  it('should have authUser property', () => {
    expect(component.authUser()).toBeDefined();
  });

  it('should ask the app to open the login dialog from the sign-up button', () => {
    let opened = 0;
    TestBed.inject(LoginService).openLogin.subscribe(() => opened++);
    const signUp = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('.slide2 button'));

    expect(signUp.map(b => b.textContent.trim())).toEqual(['Sign-up Now']);
    signUp[0].click();

    expect(opened).toBe(1);
  });

  it('should send a logged in user to the team section instead of the sign-up', async () => {
    TestBed.inject(LoginService)['_applicationUser'].set({ id: 'user-1' } as ApplicationUser);
    await fixture.whenStable();

    const buttons = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('.slide2 button'));
    expect(buttons.map(b => b.textContent.trim())).toEqual(['Go to Team Section']);
  });

  it('should clear the subscription email from a named button that does not submit the form', async () => {
    const email = fixture.nativeElement.querySelector('#subemail') as HTMLInputElement;
    const clear = () => email.closest('igx-input-group').querySelector<HTMLButtonElement>('igx-suffix button');
    expect(clear()).toBeNull();

    email.value = 'fan@example.com';
    email.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(clear().type).toBe('button');
    expect(clear().getAttribute('aria-label')).toBe('Clear email');

    clear().click();
    await fixture.whenStable();

    expect(component.userEmail()).toBe('');
    expect(email.value).toBe('');
    expect(clear()).toBeNull();
  });

  // TODO: Add more test cases with UI interactions
});
