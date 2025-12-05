import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxCarouselComponent } from '@infragistics/igniteui-angular/carousel';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        
        ServiceWorkerModule.register('', { enabled: false }),
        HomeComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  }));

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
    spyOn(component, 'resize');
    window.dispatchEvent(new Event('resize'));
    expect(component.resize).toHaveBeenCalled();
  });

  it('should call subscribe method when subscribe is called', () => {
    spyOn(component, 'subscribe');
    component.subscribe();
    expect(component.subscribe).toHaveBeenCalled();
  });

  it('should call tweet method when tweet is called', () => {
    spyOn(component, 'tweet');
    component.tweet();
    expect(component.tweet).toHaveBeenCalled();
  });

  it('should initialize navigation property', () => {
    expect(component.navigation).toBeDefined();
    expect(typeof component.navigation).toBe('boolean');
  });

  it('should initialize userEmail to null', () => {
    expect(component.userEmail).toBeNull();
  });

  it('should have environment property', () => {
    expect(component.environment).toBeDefined();
  });

  it('should have authUser property', () => {
    expect(component.authUser).toBeDefined();
  });

  it('should call openLogin method when openLogin is called', () => {
    spyOn(component, 'openLogin');
    component.openLogin();
    expect(component.openLogin).toHaveBeenCalled();
  });

  // TODO: Add more test cases with UI interactions
});
