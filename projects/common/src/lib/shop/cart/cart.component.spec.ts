import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './cart.component';
import { CartService } from '../../../services/cart.service';
import { Brand, DeliveryMethod, Product, ProductType, Quote } from '../../../models/shop';

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
    httpMock.verify();
    localStorage.clear();
  });

  /** Puts a product in the cart and settles the quote the page renders from. */
  const fill = (product = umbrella(), quantity = 1, value: Quote = quote()) => {
    cart.add(product, null, quantity);
    fixture.detectChanges();
    cart.quote.set(value);
    cart.quoting.set(false);
    fixture.detectChanges();
  };

  const showQuote = (value: Quote) => {
    cart.quote.set(value);
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

  it('prices a line from the product discount', () => {
    fill(umbrella({ price: 20, discountPercentage: 15 }));

    expect(component.unitPrice(cart.items()[0])).toBe(17);
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

    component.promoInput.set(' save10 ');
    component.applyPromo();

    expect(cart.promoCode()).toBe('SAVE10');
    expect(cart.request().promoCode).toBe('SAVE10');
  });

  it('confirms an applied promo code', () => {
    fill();
    component.promoInput.set('SAVE10');
    component.applyPromo();

    showQuote(quote({ promoApplied: true, promoCode: 'SAVE10', discountTotal: 1.5, total: 19.5 }));

    expect(fixture.nativeElement.textContent).toContain('Promo code applied');
    expect(fixture.nativeElement.textContent).toContain('19.50');
  });

  it('clears the promo code', () => {
    fill();
    component.promoInput.set('SAVE10');
    component.applyPromo();

    component.clearPromo();

    expect(component.promoInput()).toBe('');
    expect(cart.promoCode()).toBeNull();
    expect(cart.request().promoCode).toBeNull();
  });

  it('shows the promo problem the server reported', () => {
    fill();

    showQuote(quote({ promoProblem: 'Promo code has expired.' }));

    expect(fixture.nativeElement.textContent).toContain('Promo code has expired.');
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

  it('disables checkout while the quote is invalid', () => {
    fill();

    showQuote(quote({ isValid: false }));

    const checkout = fixture.nativeElement.querySelector('.checkout-button');
    expect(checkout.classList.contains('disabled')).toBe(true);
    expect(checkout.getAttribute('aria-disabled')).toBe('true');
  });

  it('disables checkout while the cart is being re-priced', () => {
    fill();

    cart.quoting.set(true);
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
});
