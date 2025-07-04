import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderformComponent } from './orderform.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY_JERSEY_ORDER } from 'bellum-gens-common';

describe('OrderformComponent', () => {
  let component: OrderformComponent;
  let fixture: ComponentFixture<OrderformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
      OrderformComponent,
      NoopAnimationsModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize order with EMPTY_JERSEY_ORDER', () => {
    expect(component.order).toBeDefined();
    // Optionally check for properties if EMPTY_JERSEY_ORDER is known
    // Expect different reference, same values
    expect(component.order).not.toBe(EMPTY_JERSEY_ORDER)
    expect(component.order).toEqual(EMPTY_JERSEY_ORDER);
  });

  it('should have basePromo set to 0.3', () => {
    expect(component.basePromo).toBe(0.3);
  });

  it('should have basePrice set to 60', () => {
    expect(component.basePrice).toBe(60);
  });

  it('should have countryCode set to "+359"', () => {
    expect(component.countryCode).toBe('+359');
  });

  it('should set jersey.cut when selectJerseyCut is called', () => {
    const jersey = { cut: null } as any;
    const event = { newSelection: { value: 'testCut' } } as any;
    component.selectJerseyCut(jersey, event);
    expect(jersey.cut).toBe('testCut');
  });

  it('should set jersey.size when selectJerseySize is called', () => {
    const jersey = { size: null } as any;
    const event = { newSelection: { value: 'testSize' } } as any;
    component.selectJerseySize(jersey, event);
    expect(jersey.size).toBe('testSize');
  });

  it('should set inProgress to true and call apiService.submitOrder on placeOrder', () => {
    const apiService = (component as any).apiService;
    spyOn(apiService, 'submitOrder').and.returnValue({
      subscribe: (handlers: any) => {
        handlers.next();
        handlers.complete();
      }
    });
    component.inProgress = false;
    component.placeOrder();
    expect(component.inProgress).toBe(false); // after complete
    expect(apiService.submitOrder).toHaveBeenCalledWith(component.order);
  });

  it('should check promo code and set promo and invalidPromo correctly (valid promo)', () => {
    const apiService = (component as any).apiService;
    component.order.promoCode = 'PROMO';
    spyOn(apiService, 'checkForPromo').and.returnValue({
      subscribe: (cb: any) => cb({ discount: 0.1 })
    });
    component.promo = component.basePromo;
    component.invalidPromo = true;
    component.checkForPromo();
    expect(component.promo).toBe(component.basePromo + 0.1);
    expect(component.invalidPromo).toBe(false);
  });

  it('should check promo code and set invalidPromo to true if promo is invalid', () => {
    const apiService = (component as any).apiService;
    component.order.promoCode = 'INVALID';
    spyOn(apiService, 'checkForPromo').and.returnValue({
      subscribe: (cb: any) => cb(null)
    });
    component.invalidPromo = false;
    component.checkForPromo();
    expect(component.order.promoCode).toBeNull();
    expect(component.invalidPromo).toBe(true);
  });
});
