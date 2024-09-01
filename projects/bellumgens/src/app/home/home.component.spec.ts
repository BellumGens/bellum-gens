import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxCarouselComponent } from '@infragistics/igniteui-angular';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        HomeComponent
      ]
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

  it('should call openLogin method when openLogin is called', () => {
    spyOn(component, 'openLogin');
    component.openLogin();
    expect(component.openLogin).toHaveBeenCalled();
  });

  // TODO: Add more test cases with UI interactions
});
