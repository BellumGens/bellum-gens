import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopComponent } from './shop.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './shop.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Order, OrderformComponent } from '../../../../common/src/public_api';
import { BaseDirective } from '../../../../bellumgens/src/app/base/base.component';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter(routes)]
    }).compileComponents();
  });

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

  it('should render the order form', () => {
    expect(fixture.debugElement.query(By.directive(OrderformComponent))).toBeTruthy();
  });

  it('should handle the orderSuccess event of the order form', () => {
    vi.spyOn(component, 'onOrderSuccess').mockImplementation(() => undefined);
    const orderForm: OrderformComponent = fixture.debugElement.query(By.directive(OrderformComponent)).componentInstance;
    orderForm.orderSuccess.emit({} as Order);
    expect(component.onOrderSuccess).toHaveBeenCalled();
  });

  it('should navigate to order-success on order success', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => undefined);

    const orderForm: OrderformComponent = fixture.debugElement.query(By.directive(OrderformComponent)).componentInstance;
    orderForm.orderSuccess.emit({} as Order);

    expect(router.navigate).toHaveBeenCalledWith(['shop', 'order-success']);
  });

  it('should extend BaseDirective', () => {
    expect(component instanceof BaseDirective).toBe(true);
  });
});
