import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShopComponent } from './shop.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './shop.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';
import { BaseDirective } from '../../../../bellumgens/src/app/base/base.component';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ShopComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter(routes)]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have basePromo set to 0.3', () => {
    expect(component.basePromo).toBe(0.3);
  });

  it('should have basePrice set to 60', () => {
    expect(component.basePrice).toBe(60);
  });

  it('should have orderForm ViewChild', () => {
    expect(component.orderForm).toBeDefined();
  });

  it('should subscribe to orderSuccess event on init', () => {
    spyOn(component.orderForm.orderSuccess, 'subscribe');
    component.ngOnInit();
    expect(component.orderForm.orderSuccess.subscribe).toHaveBeenCalled();
  });

  it('should navigate to order-success on order success', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.ngOnInit();
    component.orderForm.orderSuccess.emit();

    expect(router.navigate).toHaveBeenCalledWith(['shop', 'order-success']);
  });

  it('should extend BaseDirective', () => {
    expect(component instanceof BaseDirective).toBe(true);
  });
});
