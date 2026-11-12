import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './cart.component';
import { CartService } from 'bellum-gens-common/services';
import { Brand, DeliveryMethod, Product, ProductType, Quote } from 'bellum-gens-common/models';

const umbrella = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Rain Umbrella',
  slug: 'rain-umbrella',
  type: ProductType.Umbrella,
  brand: Brand.BellumGens,
  price: 15,
  galleryUrls: [],
  active: true,
  sortOrder: 0,
  variants: [],
  ...overrides
});

const quote = (overrides: Partial<Quote> = {}): Quote => ({
  lines: [{ productId: 'p1', productName: 'Rain Umbrella', unitPrice: 15, quantity: 1, lineTotal: 15 }],
  subtotal: 15,
  discountTotal: 0,
  shippingCost: 6,
  total: 21,
  currency: 'EUR',
  promoApplied: false,
  freeShipping: false,
  isValid: true,
  ...overrides
});

/**
 * The cart page renders whatever the cart service holds and hands edits back to it. The debounced
 * re-pricing round trip itself is covered by the CartService spec, so these tests set the quote
 * directly and assert what the page shows and what it asks the service to change.
 */
describe('CartComponent', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;
  let httpMock: HttpTestingController;
  let cart: CartService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CartComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    cart = TestBed.inject(CartService);
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // The page reads the per-line limit, which loads the storefront settings; tests that care flush it themselves.
    httpMock.match(req => req.url.endsWith('/shop/settings'));
    httpMock.verify();
    localStorage.clear();
  });

  /** Puts a product in the cart and settles the quote the page renders from. */
  const fill = (product = umbrella(), quantity = 1, value: Quote = quote()) => {
    cart.add(product, null, quantity);
    fixture.detectChanges();
    cart['_quote'].set(value);
    cart['_quoting'].set(false);
    fixture.detectChanges();
  };

  const showQuote = (value: Quote) => {
    cart['_quote'].set(value);
    fixture.detectChanges();
  };

  it('invites the visitor to the shop while the cart is empty', () => {
    expect(cart.isEmpty()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Your cart is empty');
    expect(fixture.nativeElement.querySelectorAll('.cart-line').length).toBe(0);
  });

  it('renders a line per cart item with its totals', () => {
    fill(umbrella(), 2);

    const lines = fixture.nativeElement.querySelectorAll('.cart-line');
    expect(lines.length).toBe(1);
    expect(lines[0].textContent).toContain('Rain Umbrella');
    expect(lines[0].textContent).toContain('30.00');
  });

  it('shows the product image on its line when there is one', () => {
    fill(umbrella({ imageUrl: '/umbrella.png' }));

    const image: HTMLImageElement = fixture.nativeElement.querySelector('.line-image img');
    expect(image.getAttribute('src')).toBe('/umbrella.png');
  });

  it('shows a placeholder icon instead of an image when the product has none', () => {
    fill(umbrella({ imageUrl: null }));

    const link: HTMLElement = fixture.nativeElement.querySelector('.line-image');
    expect(link.querySelector('img')).toBeNull();
    expect(link.querySelector('igx-icon')?.textContent?.trim()).toBe('shopping_bag');
  });

  it('keeps the image link out of the tab order and the accessibility tree, next to the named product link', () => {
    fill(umbrella({ imageUrl: null }));

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.line-image');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelector('a.line-name').textContent.trim()).toBe('Rain Umbrella');
  });

  it('keeps variants of one product on separate lines', () => {
    const jersey = umbrella({
      id: 'jersey',
      name: 'EBL Jersey',
      variants: [
        { id: 'v1', name: 'Male / L', active: true, sortOrder: 0, stockQuantity: 5 },
        { id: 'v2', name: 'Female / M', active: true, sortOrder: 1, stockQuantity: 5 }
      ]
    });
    cart.add(jersey, jersey.variants[0]);
    cart.add(jersey, jersey.variants[1]);
    fixture.detectChanges();

    const variantLabels = [...fixture.nativeElement.querySelectorAll('.line-variant')].map(el => el.textContent.trim());
    expect(variantLabels).toEqual(['Male / L', 'Female / M']);
  });

  it('prices a line from the product discount until the server quotes it', () => {
    fill(umbrella({ price: 20, discountPercentage: 15 }), 1, quote({ lines: [] }));

    expect(component.unitPrice(cart.items()[0])).toBe(17);
  });

  it('prices a line from the server quote over the price saved with the item', () => {
    fill(umbrella({ price: 40 }), 2, quote({
      lines: [{ productId: 'p1', productName: 'Rain Umbrella', unitPrice: 30, quantity: 2, lineTotal: 60 }],
      subtotal: 60
    }));

    expect(component.unitPrice(cart.items()[0])).toBe(30);
    const line: HTMLElement = fixture.nativeElement.querySelector('.cart-line');
    expect(line.querySelector('.line-unit')?.textContent).toContain('30.00');
    expect(line.querySelector('.line-total')?.textContent).toContain('60.00');
  });

  it('prices a line from the variant override', () => {
    const product = umbrella({
      variants: [{ id: 'v1', name: 'Large', priceOverride: 25, active: true, sortOrder: 0, stockQuantity: null }]
    });
    cart.add(product, product.variants[0]);
    fixture.detectChanges();

    expect(component.unitPrice(cart.items()[0])).toBe(25);
  });

  it('surfaces the server problem for a line', () => {
    fill();

    showQuote(quote({
      isValid: false,
      lines: [{ productId: 'p1', productName: 'Rain Umbrella', unitPrice: 15, quantity: 1, lineTotal: 15, problem: 'Sold out.' }]
    }));

    expect(component.problem(cart.items()[0])).toBe('Sold out.');
    expect(fixture.nativeElement.querySelector('.cart-line.has-problem')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('no longer available in the selected quantity');
  });

  it('reports no problem for a line the server accepted', () => {
    fill();

    expect(component.problem(cart.items()[0])).toBeNull();
    expect(fixture.nativeElement.querySelector('.cart-line.has-problem')).toBeNull();
  });

  it('changes a line quantity and removes it at zero', () => {
    fill();

    cart.setQuantity(cart.items()[0], 3);
    fixture.detectChanges();
    expect(cart.count()).toBe(3);
    expect(fixture.nativeElement.querySelector('.quantity-value').textContent).toContain('3');

    cart.setQuantity(cart.items()[0], 0);
    fixture.detectChanges();
    expect(cart.isEmpty()).toBe(true);
  });

  it('applies a promo code in upper case and puts it on the next quote request', () => {
    fill();

    component.promoInput.setValue(' save10 ');
    component.applyPromo();

    expect(cart.promoCode()).toBe('SAVE10');
    expect(cart.request().promoCode).toBe('SAVE10');
  });

  it('confirms an applied promo code', () => {
    fill();
    component.promoInput.setValue('SAVE10');
    component.applyPromo();

    showQuote(quote({ promoApplied: true, promoCode: 'SAVE10', discountTotal: 1.5, total: 19.5 }));

    expect(fixture.nativeElement.textContent).toContain('Promo code applied');
    expect(fixture.nativeElement.textContent).toContain('19.50');
  });

  it('clears the promo code', () => {
    fill();
    component.promoInput.setValue('SAVE10');
    component.applyPromo();

    component.clearPromo();

    expect(component.promoInput.value).toBe('');
    expect(cart.promoCode()).toBeNull();
    expect(cart.request().promoCode).toBeNull();
  });

  it('shows the promo problem the server reported', () => {
    fill();

    showQuote(quote({ promoProblem: 'Promo code has expired.' }));

    expect(fixture.nativeElement.textContent).toContain('Promo code has expired.');
  });

  it('applies the promo code when the field loses focus, without an apply button', () => {
    fill();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#promoCode');

    input.value = 'save10';
    input.dispatchEvent(new Event('input'));
    expect(cart.promoCode()).toBeNull();
    input.dispatchEvent(new Event('blur'));

    expect(cart.promoCode()).toBe('SAVE10');
    expect(fixture.nativeElement.querySelector('.promo-form button[type="submit"]')).toBeNull();
  });

  it('applies the promo code when Enter submits the field', () => {
    fill();
    component.promoInput.setValue('save10');

    fixture.nativeElement.querySelector('.promo-form').dispatchEvent(new Event('submit'));

    expect(cart.promoCode()).toBe('SAVE10');
  });

  it('offers courier delivery only while event pickup is not available', () => {
    fill();

    expect(fixture.nativeElement.querySelector('igx-radio-group')).toBeNull();
    expect(fixture.nativeElement.querySelector('.delivery-method').textContent).toContain('Courier delivery');
    expect(fixture.nativeElement.textContent).not.toContain('Pick up at an event');
  });

  it('says that delivery is within Bulgaria only', () => {
    fill();

    expect(fixture.nativeElement.querySelector('.delivery-country').textContent).toContain('We currently deliver within Bulgaria only.');
  });

  it('switches the delivery method and puts it on the next quote request', () => {
    fill();

    component.setDelivery(`${DeliveryMethod.EventPickup}`);

    expect(cart.deliveryMethod()).toBe(DeliveryMethod.EventPickup);
    expect(cart.request().deliveryMethod).toBe(DeliveryMethod.EventPickup);
  });

  it('shows free shipping instead of a shipping charge', () => {
    fill();

    showQuote(quote({ shippingCost: 0, freeShipping: true, total: 15 }));

    expect(fixture.nativeElement.textContent).toContain('Free');
    expect(fixture.nativeElement.textContent).not.toContain('6.00');
  });

  it('shows the discount line only when there is a discount', () => {
    fill();
    expect(fixture.nativeElement.textContent).not.toContain('Discount');

    showQuote(quote({ discountTotal: 2.5, total: 18.5 }));

    expect(fixture.nativeElement.textContent).toContain('Discount');
    expect(fixture.nativeElement.textContent).toContain('2.50');
  });

  it('blocks checkout and says why while a promo code does not apply', () => {
    fill();

    showQuote(quote({ promoCode: 'SUMMER10', promoApplied: false, promoProblem: 'Promo code has expired.', isValid: false }));

    const checkout = fixture.nativeElement.querySelector('.checkout-button');
    expect(checkout.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Remove it to continue to checkout');
    // The lines themselves are fine, so the page does not claim items are unavailable.
    expect(fixture.nativeElement.textContent).not.toContain('no longer available in the selected quantity');
  });

  it('disables checkout while the quote is invalid', () => {
    fill();

    showQuote(quote({ isValid: false }));

    const checkout = fixture.nativeElement.querySelector('.checkout-button');
    expect(checkout.classList.contains('disabled')).toBe(true);
    expect(checkout.getAttribute('aria-disabled')).toBe('true');
  });

  it('disables checkout while the cart is being re-priced', () => {
    fill();

    cart['_quoting'].set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.checkout-button').classList.contains('disabled')).toBe(true);
  });

  it('enables checkout once the quote is valid', () => {
    fill();

    const checkout = fixture.nativeElement.querySelector('.checkout-button');
    expect(cart.quoting()).toBe(false);
    expect(checkout.classList.contains('disabled')).toBe(false);
    expect(checkout.getAttribute('href')).toBe('/shop/checkout');
  });

  it('offers a retry instead of a spinner when pricing the cart failed', () => {
    fill();
    cart['_quote'].set(null);
    cart['_quoteFailed'].set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cart-summary igx-circular-bar')).toBeNull();
    const error: HTMLElement = fixture.nativeElement.querySelector('.quote-error');
    expect(error.textContent).toContain('could not calculate the price');

    error.querySelector('button')!.click();
    httpMock.expectOne(req => req.url.endsWith('/shop/quote')).flush(quote());
    fixture.detectChanges();

    expect(cart.quoteFailed()).toBe(false);
    expect(fixture.nativeElement.querySelector('.quote-error')).toBeNull();
  });

  it('caps the increase button at the per-line limit', () => {
    fill(umbrella(), CartService.defaultMaxLineQuantity);

    const increase: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.line-quantity button')[1];
    expect(increase.disabled).toBe(true);
  });

  it('caps the increase button at the per-line limit the admin set', () => {
    fill(umbrella(), 3);
    httpMock.expectOne(req => req.url.endsWith('/shop/settings'))
      .flush({ shippingCost: 6, freeShippingThreshold: 50, maxQuantityPerLine: 3, currency: 'EUR' });
    fixture.detectChanges();

    const increase: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.line-quantity button')[1];
    expect(increase.disabled).toBe(true);
    expect(component.maxQuantity()).toBe(3);
  });
});
