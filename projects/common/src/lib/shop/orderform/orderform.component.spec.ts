import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OrderformComponent } from './orderform.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxSelectComponent } from '@infragistics/igniteui-angular/select';
import { EMPTY_JERSEY_ORDER } from 'bellum-gens-common';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { JerseyCut, JerseySize, Order } from '../../../models/order';

describe('OrderformComponent', () => {
  let component: OrderformComponent;
  let fixture: ComponentFixture<OrderformComponent>;
  let httpMock: HttpTestingController;
  let shopService: ApiShopService;

  const orderUrl = () => `${shopService['_apiEndpoint']}/shop/order`;
  const promoUrl = (code: string) => `${shopService['_apiEndpoint']}/shop/promo?code=${code}`;

  const el = (): HTMLElement => fixture.nativeElement;
  const input = (id: string): HTMLInputElement => el().querySelector(`#${id}`);
  const clearButton = (id: string): HTMLButtonElement => input(id).closest('igx-input-group').querySelector('igx-suffix button');
  const label = (id: string): HTMLLabelElement => el().querySelector(`label[for="${id}"]`);
  const orderButton = (): HTMLButtonElement =>
    Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent.trim() === 'Order');
  const addButton = (): HTMLButtonElement =>
    Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent.includes('Add one more'));
  const removeButtons = (): HTMLButtonElement[] =>
    Array.from(el().querySelectorAll<HTMLButtonElement>('.column-container > .horizontal-center > button'));
  const summary = () => el().querySelector('.order-summary').textContent;
  const selects = (): IgxSelectComponent[] =>
    fixture.debugElement.queryAll(By.directive(IgxSelectComponent)).map(s => s.componentInstance as IgxSelectComponent);
  const cutSelect = (row: number) => selects()[row * 2];
  const sizeSelect = (row: number) => selects()[row * 2 + 1];

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const type = async (id: string, value: string) => {
    const field = input(id);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    await render();
  };

  const blur = async (id: string) => {
    input(id).dispatchEvent(new Event('blur'));
    await render();
  };

  // igxMask only parses input relative to the caret position it recorded, so simulate pasting into the empty mask
  const pastePhone = async (digits: string) => {
    const phone = input('orderPhone');
    phone.dispatchEvent(new Event('focus'));
    phone.setSelectionRange(0, 0);
    phone.dispatchEvent(new Event('paste'));
    phone.value = digits;
    phone.dispatchEvent(new Event('input'));
    await render();
  };

  const choose = async (select: IgxSelectComponent, value: JerseyCut | JerseySize) => {
    select.selectItem(select.items.find(i => i.value === value));
    await render();
  };

  const fillValidForm = async () => {
    await type('firstName', 'Ivan');
    await type('lastName', 'Petrov');
    await type('orderemail', 'ivan@example.com');
    await type('orderCity', 'Sofia');
    await type('orderAddress', 'Vitosha 1');
    await pastePhone('888123456');
    await blur('firstName');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
      OrderformComponent,
      NoopAnimationsModule
    ],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    shopService = TestBed.inject(ApiShopService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize order with EMPTY_JERSEY_ORDER', () => {
    expect(component.order()).toBeDefined();
    // Expect different reference, same values
    expect(component.order()).not.toBe(EMPTY_JERSEY_ORDER);
    expect(component.order().orderProducts).not.toBe(EMPTY_JERSEY_ORDER.orderProducts);
    expect(component.order()).toEqual(EMPTY_JERSEY_ORDER);
  });

  it('should have basePromo set to 0.3', () => {
    expect(component.basePromo).toBe(0.3);
  });

  it('should have basePrice set to 60', () => {
    expect(component.basePrice).toBe(60);
  });

  it('should have countryCode set to "+359"', () => {
    expect(component.countryCode).toBe('+359');
    expect(input('orderPhone').closest('igx-input-group').textContent).toContain('+359');
  });

  it('should render the order summary for a single jersey', () => {
    expect(summary()).toContain('1 x 60 BGN = 60 BGN');
    expect(summary()).toContain('30% off = -18 BGN');
    expect(summary()).toContain('Total = 42 BGN');
    expect(summary()).not.toContain('Free shipping');
    // a single jersey cannot be removed
    expect(removeButtons().length).toBe(0);
  });

  describe('jersey selection', () => {
    it('should update the cut of a jersey and offer the matching sizes', async () => {
      expect(sizeSelect(0).items.map(i => i.value))
        .toEqual([JerseySize.S, JerseySize.M, JerseySize.L, JerseySize.XL, JerseySize.XXL, JerseySize.XXXL]);

      await choose(cutSelect(0), JerseyCut.Female);

      expect(component.order().orderProducts[0].cut).toBe(JerseyCut.Female);
      expect(EMPTY_JERSEY_ORDER.orderProducts[0].cut).toBe(JerseyCut.Male);
      expect(cutSelect(0).value).toBe(JerseyCut.Female);
      expect(sizeSelect(0).items.map(i => i.value))
        .toEqual([JerseySize.XS, JerseySize.S, JerseySize.M, JerseySize.L, JerseySize.XL]);
    });

    it('should switch to the closest size the new cut is available in', async () => {
      await choose(sizeSelect(0), JerseySize.XXXL);

      await choose(cutSelect(0), JerseyCut.Female);

      expect(component.order().orderProducts[0]).toEqual({ cut: JerseyCut.Female, size: JerseySize.XL });
      expect(sizeSelect(0).value).toBe(JerseySize.XL);
      expect(sizeSelect(0).selectedItem?.value).toBe(JerseySize.XL);

      await choose(sizeSelect(0), JerseySize.XS);
      await choose(cutSelect(0), JerseyCut.Male);

      expect(component.order().orderProducts[0]).toEqual({ cut: JerseyCut.Male, size: JerseySize.S });
      expect(sizeSelect(0).value).toBe(JerseySize.S);
    });

    it('should keep the size when the new cut is available in it', async () => {
      await choose(sizeSelect(0), JerseySize.M);

      await choose(cutSelect(0), JerseyCut.Female);

      expect(component.order().orderProducts[0]).toEqual({ cut: JerseyCut.Female, size: JerseySize.M });
      expect(component.hasUnavailableJersey()).toBe(false);
    });

    it('should update the size of a jersey', async () => {
      await choose(sizeSelect(0), JerseySize.XXL);

      expect(component.order().orderProducts[0].size).toBe(JerseySize.XXL);
      expect(component.order().orderProducts[0].cut).toBe(JerseyCut.Male);
      expect(EMPTY_JERSEY_ORDER.orderProducts[0].size).toBe(JerseySize.L);
    });

    it('should only change the jersey that was edited', async () => {
      addButton().click();
      await render();

      await choose(sizeSelect(1), JerseySize.S);

      expect(component.order().orderProducts.map(j => j.size)).toEqual([JerseySize.L, JerseySize.S]);
    });
  });

  describe('adding and removing jerseys', () => {
    it('should add jerseys and update the summary', async () => {
      addButton().click();
      await render();

      expect(component.productCount()).toBe(2);
      expect(component.subtotal()).toBe(2 * component.basePrice);
      expect(EMPTY_JERSEY_ORDER.orderProducts.length).toBe(1);
      expect(selects().length).toBe(4);
      expect(removeButtons().length).toBe(2);
      expect(summary()).toContain('2 x 60 BGN = 120 BGN');
      expect(summary()).toContain('Total = 84 BGN');
    });

    it('should remove the clicked jersey', async () => {
      addButton().click();
      await render();
      await choose(cutSelect(0), JerseyCut.Female);

      removeButtons()[0].click();
      await render();

      expect(component.productCount()).toBe(1);
      expect(component.order().orderProducts[0].cut).toBe(JerseyCut.Male);
      expect(removeButtons().length).toBe(0);
      expect(summary()).toContain('1 x 60 BGN = 60 BGN');
    });

    it('should offer free shipping once the discount reaches 100 BGN', async () => {
      for (let i = 0; i < 4; i++) {
        addButton().click();
      }
      await render();
      // 5 x 60 x 0.3 = 90
      expect(summary()).not.toContain('Free shipping');

      addButton().click();
      await render();
      // 6 x 60 x 0.3 = 108
      expect(summary()).toContain('Free shipping');
    });
  });

  describe('promo code', () => {
    it('should not check an empty promo code', async () => {
      await blur('promocode');

      httpMock.expectNone(r => r.url.includes('/shop/promo'));
      expect(component.promo()).toBe(component.basePromo);
    });

    it('should apply a valid promo code on blur', async () => {
      await type('promocode', 'SAVE10');
      expect(component.order().promoCode).toBe('SAVE10');
      component.invalidPromo.set(true);

      await blur('promocode');
      const req = httpMock.expectOne(promoUrl('SAVE10'));
      expect(req.request.method).toBe('GET');
      req.flush({ code: 'SAVE10', discount: 0.1 });
      await render();

      expect(component.promo()).toBe(component.basePromo + 0.1);
      expect(component.invalidPromo()).toBe(false);
      expect(summary()).toContain('40% off = -24 BGN');
      expect(summary()).toContain('Total = 36 BGN');
      expect(el().querySelector('igx-hint')).toBeNull();
    });

    it('should hide the discount when the promo cancels out the base discount', async () => {
      await type('promocode', 'NOPE');
      await blur('promocode');
      httpMock.expectOne(promoUrl('NOPE')).flush({ code: 'NOPE', discount: -0.3 });
      await render();

      expect(component.promo()).toBe(0);
      expect(summary()).not.toContain('% off');
      expect(summary()).toContain('Total = 60 BGN');
    });

    it('should clear an invalid promo code and show a hint', async () => {
      await type('promocode', 'INVALID');
      await blur('promocode');
      httpMock.expectOne(promoUrl('INVALID')).flush(null);
      await render();

      expect(component.order().promoCode).toBeNull();
      expect(component.invalidPromo()).toBe(true);
      expect(component.promo()).toBe(component.basePromo);
      expect(el().querySelector('igx-hint').textContent).toContain('Promo code is invalid...');
      expect(input('promocode').value).toBe('');
    });
  });

  describe('clearing fields', () => {
    const fields: [string, keyof Order, string][] = [
      ['promocode', 'promoCode', 'PROMO'],
      ['firstName', 'firstName', 'Ivan'],
      ['lastName', 'lastName', 'Petrov'],
      ['orderemail', 'email', 'ivan@example.com'],
      ['orderCity', 'city', 'Sofia'],
      ['orderAddress', 'streetAddress', 'Vitosha 1'],
      ['orderPhone', 'phoneNumber', '888123456']
    ];

    for (const [id, field, value] of fields) {
      it(`should clear ${field} with the suffix button`, async () => {
        expect(clearButton(id)).toBeNull();

        component.updateOrder(field, value);
        await render();
        expect(input(id).value).not.toBe('');

        clearButton(id).click();
        await render();

        expect(component.order()[field]).toBeNull();
        expect(clearButton(id)).toBeNull();
      });
    }
  });

  describe('accessibility', () => {
    it('should label every field', () => {
      expect(label('promocode').textContent.trim()).toBe('Promo code');
      expect(label('firstName').textContent.trim()).toBe('First name');
      expect(label('lastName').textContent.trim()).toBe('Last name');
      expect(label('orderemail').textContent.trim()).toBe('Email');
      expect(label('orderPhone').textContent.trim()).toBe('Phone #');
      expect(label('orderCity').textContent.trim()).toBe('City');
      expect(label('orderAddress').textContent.trim()).toBe('Street');
      expect(el().querySelectorAll('label[for="firstName"]').length).toBe(1);
    });

    it('should render the remove jersey actions as named buttons that do not submit the form', async () => {
      addButton().click();
      await render();

      for (const button of removeButtons()) {
        expect(button.type).toBe('button');
        expect(button.getAttribute('aria-label')).toBe('Remove jersey');
      }
    });

    it('should render the clear actions as named buttons that do not submit the form', async () => {
      const fields: [string, keyof Order, string][] = [
        ['promocode', 'promoCode', 'Clear promo code'],
        ['firstName', 'firstName', 'Clear first name'],
        ['lastName', 'lastName', 'Clear last name'],
        ['orderemail', 'email', 'Clear email'],
        ['orderCity', 'city', 'Clear city'],
        ['orderAddress', 'streetAddress', 'Clear street'],
        ['orderPhone', 'phoneNumber', 'Clear phone number']
      ];
      for (const [, field] of fields) {
        component.updateOrder(field, '888123456');
      }
      await render();

      for (const [id, , name] of fields) {
        expect(clearButton(id).type).toBe('button');
        expect(clearButton(id).getAttribute('aria-label')).toBe(name);
      }
    });
  });

  describe('placing an order', () => {
    it('should mask the phone number while keeping the raw digits in the order', async () => {
      await pastePhone('888123456');

      expect(input('orderPhone').value).toBe('888 12 34 56');
      expect(component.order().phoneNumber).toBe('888123456');
    });

    it('should keep the order button disabled until the form is touched and valid', async () => {
      expect(orderButton().disabled).toBe(true);

      await type('firstName', 'Ivan');
      await blur('firstName');
      // touched, but still missing required fields
      expect(orderButton().disabled).toBe(true);

      await fillValidForm();
      expect(orderButton().disabled).toBe(false);
    });

    it('should not submit a jersey in a size its cut is not available in', async () => {
      await fillValidForm();
      expect(orderButton().disabled).toBe(false);

      component.updateOrder('orderProducts', [{ cut: JerseyCut.Female, size: JerseySize.XXXL } as Order['orderProducts'][number]]);
      await render();

      expect(component.hasUnavailableJersey()).toBe(true);
      expect(orderButton().disabled).toBe(true);
      component.placeOrder();
      expect(component.inProgress()).toBe(false);
      httpMock.expectNone(orderUrl());
    });

    it('should reject an invalid email', async () => {
      await fillValidForm();
      await type('orderemail', 'not-an-email');

      expect(orderButton().disabled).toBe(true);

      await type('orderemail', 'ivan@example.com');
      expect(orderButton().disabled).toBe(false);
    });

    it('should submit the order and emit it on success', async () => {
      const emitted: Order[] = [];
      component.orderSuccess.subscribe(order => emitted.push(order));
      await fillValidForm();
      const order = component.order();

      orderButton().click();
      await render();

      expect(component.inProgress()).toBe(true);
      expect(orderButton().disabled).toBe(true);
      const req = httpMock.expectOne(orderUrl());
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        orderProducts: [{ cut: JerseyCut.Male, size: JerseySize.L }],
        firstName: 'Ivan',
        lastName: 'Petrov',
        email: 'ivan@example.com',
        city: 'Sofia',
        streetAddress: 'Vitosha 1',
        phoneNumber: '888123456'
      });
      req.flush(order);
      await render();

      expect(emitted).toEqual([order]);
      expect(component.inProgress()).toBe(false);
    });

    it('should re-enable ordering without emitting when submitting fails', async () => {
      const emitted: Order[] = [];
      component.orderSuccess.subscribe(order => emitted.push(order));
      await fillValidForm();

      orderButton().click();
      await render();
      expect(component.inProgress()).toBe(true);

      httpMock.expectOne(orderUrl()).flush('Server error', { status: 500, statusText: 'Server Error' });
      await render();

      expect(emitted).toEqual([]);
      expect(component.inProgress()).toBe(false);
      expect(orderButton().disabled).toBe(false);
    });
  });
});
