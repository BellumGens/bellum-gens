import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartBadgeComponent } from './cart-badge.component';
import { CartService } from '../../../services/cart.service';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { Brand, Product, ProductType } from '../../../models/shop';

const umbrella: Product = {
  id: 'p1',
  name: 'Rain Umbrella',
  slug: 'rain-umbrella',
  type: ProductType.Umbrella,
  brand: Brand.BellumGens,
  price: 15,
  galleryUrls: [],
  active: true,
  sortOrder: 0,
  variants: []
};

describe('CartBadgeComponent', () => {
  let fixture: ComponentFixture<CartBadgeComponent>;
  let httpMock: HttpTestingController;
  let cart: CartService;
  let api: ApiShopService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CartBadgeComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    cart = TestBed.inject(CartService);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(CartBadgeComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  const drainQuotes = () => {
    TestBed.tick();
    tick(300);
    httpMock.match(`${api['_apiEndpoint']}/shop/quote`).forEach(request => request.flush(null));
  };

  it('links to the cart', () => {
    const link = fixture.nativeElement.querySelector('a.cart-badge') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/shop/cart');
    expect(fixture.nativeElement.querySelector('igx-icon').textContent).toContain('shopping_cart');
  });

  it('hides the badge while the cart is empty', () => {
    expect(fixture.nativeElement.querySelector('igx-badge')).toBeNull();
  });

  it('shows the number of items once the cart has some', fakeAsync(() => {
    cart.add(umbrella, null, 2);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('igx-badge')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('igx-badge').textContent).toContain('2');
    drainQuotes();
  }));

  it('hides the badge again when the cart is cleared', fakeAsync(() => {
    cart.add(umbrella);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('igx-badge')).not.toBeNull();

    cart.clear();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('igx-badge')).toBeNull();
    drainQuotes();
  }));
});
