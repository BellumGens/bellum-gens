import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../../services/cart.service';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { Brand, Product, ProductType, ProductVariant } from '../../../models/shop';

const variant = (id: string, name: string, stockQuantity: number | null = null): ProductVariant =>
  ({ id, name, stockQuantity, active: true, sortOrder: 0 });

const product = (overrides: Partial<Product> = {}): Product => ({
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

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;
  let httpMock: HttpTestingController;
  let cart: CartService;
  let api: ApiShopService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    cart = TestBed.inject(CartService);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  /** Adding to the cart triggers the cart's debounced re-pricing; answer it so the queue stays clean. */
  const drainQuotes = () => {
    TestBed.tick();
    tick(300);
    httpMock.match(`${api['_apiEndpoint']}/shop/quote`).forEach(request => request.flush(null));
  };

  const show = (value: Product) => {
    fixture.componentRef.setInput('product', value);
    fixture.detectChanges();
  };

  it('renders the product name, brand and price', () => {
    show(product());

    const text = fixture.nativeElement.textContent as string;
    expect(component.brandName()).toBe('Bellum Gens');
    expect(text).toContain('Rain Umbrella');
    expect(text).toContain('Bellum Gens');
    expect(text).toContain('15.00');
  });

  it('shows the discounted price next to the original one', () => {
    show(product({ price: 20, discountPercentage: 15 }));

    expect(component.hasDiscount()).toBe(true);
    expect(component.price()).toBe(17);
    expect(fixture.nativeElement.querySelector('del').textContent).toContain('20.00');
  });

  it('is not marked sold out when stock is not tracked', () => {
    show(product({ stockQuantity: null }));

    expect(component.soldOut()).toBe(false);
  });

  it('is sold out when the tracked stock is exhausted', () => {
    show(product({ stockQuantity: 0 }));

    expect(component.soldOut()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Sold out');
  });

  it('is sold out when every variant is sold out', () => {
    show(product({ variants: [variant('v1', 'Male / L', 0), variant('v2', 'Female / M', 0)] }));

    expect(component.soldOut()).toBe(true);
  });

  it('is available while any variant has stock', () => {
    show(product({ variants: [variant('v1', 'Male / L', 0), variant('v2', 'Female / M', 2)] }));

    expect(component.soldOut()).toBe(false);
  });

  it('adds a simple product straight to the cart', fakeAsync(() => {
    const simple = product();
    show(simple);

    component.addToCart();

    expect(cart.count()).toBe(1);
    expect(cart.items()[0].productId).toBe('p1');
    expect(cart.items()[0].variantId).toBeUndefined();
    drainQuotes();
  }));

  it('does not add a product that needs an option chosen', fakeAsync(() => {
    show(product({ variants: [variant('v1', 'Male / L', 5)] }));

    component.addToCart();

    expect(component.hasOptions()).toBe(true);
    expect(cart.isEmpty()).toBe(true);
    drainQuotes();
  }));

  it('does not add a sold out product', fakeAsync(() => {
    show(product({ stockQuantity: 0 }));

    component.addToCart();

    expect(cart.isEmpty()).toBe(true);
    drainQuotes();
  }));

  it('hides the add button for products with options', () => {
    show(product({ variants: [variant('v1', 'Male / L', 5)] }));

    expect(fixture.nativeElement.querySelector('button[igxbutton], button')).toBeNull();
  });

  it('links to the product page by slug', () => {
    show(product());

    const link = fixture.nativeElement.querySelector('a.product-media') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/shop/product/rain-umbrella');
  });
});
