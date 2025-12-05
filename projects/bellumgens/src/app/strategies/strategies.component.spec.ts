import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategiesComponent } from './strategies.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StrategiesComponent', () => {
  let component: StrategiesComponent;
  let fixture: ComponentFixture<StrategiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        StrategiesComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              parent: {
                params: new Observable()
              }
            },
            data: new Observable(),
            url: new Observable()
          }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have maps array initialized', () => {
    expect(component.maps).toBeDefined();
    expect(Array.isArray(component.maps)).toBe(true);
  });

  it('should initialize loading to false', () => {
    expect(component.loading).toBe(false);
  });

  it('should initialize page to 0', () => {
    expect(component.page).toBe(0);
  });

  it('should initialize viewAll to false', () => {
    expect(component.viewAll).toBe(false);
  });

  it('should have overlaySettings property', () => {
    expect(component.overlaySettings).toBeDefined();
  });
});
