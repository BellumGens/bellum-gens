import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { ProductDetailComponent } from './product-detail.component';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { CartService } from '../../../services/cart.service';
import { Brand, JerseyCut, JerseySize, Product, ProductType, ProductVariant } from '../../../models/shop';

const jerseyVariant = (id: string, cut: JerseyCut, size: JerseySize, stockQuantity: number | null): ProductVariant =>
  ({ id, name: `${cut === JerseyCut.Male ? 'Male' : 'Female'} / ${JerseySize[size]}`, cut, size, stockQuantity, active: true, sortOrder: 0 });

const jersey = (): Product => ({
  id: 'jersey',
  name: 'EBL Jersey',
  slug: 'ebl-jersey',
  description: 'Breathable polyester',
  type: ProductType.Jersey,
  brand: Brand.EBLeague,
  price: 30,
  imageUrl: '/main.png',
  galleryUrls: ['/back.png'],
  active: true,
  sortOrder: 0,
  variants: [
    jerseyVariant('v-male-l', JerseyCut.Male, JerseySize.L, 5),
    jerseyVariant('v-male-xl', JerseyCut.Male, JerseySize.XL, 0),
    jerseyVariant('v-female-m', JerseyCut.Female, JerseySize.M, 1)
  ]
});

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

describe('ProductDetailComponent', () => {
  let fixture: ComponentFixture<ProductDetailComponent>;
  let component: ProductDetailComponent;
  let httpMock: HttpTestingController;
  let api: ApiShopService;
  let cart: CartService;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    localStorage.clear();
    params = new BehaviorSubject(convertToParamMap({ slug: 'ebl-jersey' }));
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
    cart = TestBed.inject(CartService);
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  const productUrl = (slug: string) => `${api['_apiEndpoint']}/shop/products/${slug}`;

  /** The route param is fixed per test, so the request URL comes from it, not from the product returned. */
  const load = (value: Product = jersey(), slug = 'ebl-jersey') => {
    fixture.detectChanges();
    httpMock.expectOne(productUrl(slug)).flush(value);
    fixture.detectChanges();
  };

  const drainQuotes = () => {
    TestBed.tick();
    tick(300);
    httpMock.match(`${api['_apiEndpoint']}/shop/quote`).forEach(request => request.flush(null));
  };

  it('loads the product named in the route and sets the page title', () => {
    load();

    expect(component.product()?.slug).toBe('ebl-jersey');
    expect(TestBed.inject(Title).getTitle()).toBe('EBL Jersey | Bellum Gens Shop');
    expect(fixture.nativeElement.textContent).toContain('Breathable polyester');
  });

  it('shows a not found message when the product is gone', () => {
    fixture.detectChanges();
    httpMock.expectOne(productUrl('ebl-jersey')).flush('', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component.notFound()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('We could not find this product');
  });

  it('preselects the first cut and size of a jersey', () => {
    load();

    expect(component.hasCutAndSize()).toBe(true);
    expect(component.cuts()).toEqual([JerseyCut.Male, JerseyCut.Female]);
    expect(component.cut()).toBe(JerseyCut.Male);
    expect(component.size()).toBe(JerseySize.L);
    expect(component.selectedVariant()?.id).toBe('v-male-l');
    expect(component.stock()).toBe(5);
    expect(component.canAdd()).toBe(true);
  });

  it('offers only the sizes that exist for the chosen cut', () => {
    load();

    expect(component.sizes()).toEqual([JerseySize.L, JerseySize.XL]);

    component.selectCut({ newSelection: { value: JerseyCut.Female } } as never);

    expect(component.sizes()).toEqual([JerseySize.M]);
    expect(component.size()).toBe(JerseySize.M);
    expect(component.selectedVariant()?.id).toBe('v-female-m');
    expect(component.stock()).toBe(1);
  });

  it('marks a size with no stock as unavailable', () => {
    load();

    expect(component.sizeAvailable(JerseySize.L)).toBe(true);
    expect(component.sizeAvailable(JerseySize.XL)).toBe(false);
  });

  it('reports a sold out selection and blocks adding it', () => {
    load();

    component.selectSize({ newSelection: { value: JerseySize.XL } } as never);

    expect(component.selectedVariant()?.id).toBe('v-male-xl');
    expect(component.soldOut()).toBe(true);
    expect(component.canAdd()).toBe(false);
  });

  it('caps the quantity at the remaining stock', () => {
    load();

    component.changeQuantity(10);
    expect(component.quantity()).toBe(5);

    component.changeQuantity(-10);
    expect(component.quantity()).toBe(1);
  });

  it('caps the quantity at the per line maximum when stock is not tracked', () => {
    load(umbrella());

    component.changeQuantity(50);

    expect(component.quantity()).toBe(component.maxQuantity);
  });

  it('adds the selected variant and quantity to the cart', fakeAsync(() => {
    load();
    component.changeQuantity(2);

    component.addToCart();

    expect(cart.items().length).toBe(1);
    expect(cart.items()[0].variantId).toBe('v-male-l');
    expect(cart.items()[0].quantity).toBe(3);
    drainQuotes();
  }));

  it('adds a product without options directly', fakeAsync(() => {
    load(umbrella());

    expect(component.hasVariants()).toBe(false);
    component.addToCart();

    expect(cart.items()[0].variantId).toBeUndefined();
    drainQuotes();
  }));

  it('does not add a sold out product without options', fakeAsync(() => {
    load(umbrella({ stockQuantity: 0 }));

    component.addToCart();

    expect(component.soldOut()).toBe(true);
    expect(cart.isEmpty()).toBe(true);
    drainQuotes();
  }));

  it('selects a plain option list by id', () => {
    load(umbrella({
      variants: [
        { id: 'o1', name: 'Blue', active: true, sortOrder: 0, stockQuantity: null },
        { id: 'o2', name: 'Red', active: true, sortOrder: 1, stockQuantity: null }
      ]
    }));

    expect(component.hasCutAndSize()).toBe(false);
    expect(component.variantId()).toBe('o1');

    component.selectVariant({ newSelection: { value: 'o2' } } as never);

    expect(component.selectedVariant()?.name).toBe('Red');
  });

  it('ignores inactive variants', () => {
    load(umbrella({
      variants: [
        { id: 'o1', name: 'Blue', active: false, sortOrder: 0, stockQuantity: 5 },
        { id: 'o2', name: 'Red', active: true, sortOrder: 1, stockQuantity: 5 }
      ]
    }));

    expect(component.activeVariants().map(v => v.id)).toEqual(['o2']);
  });

  it('builds the gallery from the main image and the extra ones', () => {
    load();

    expect(component.gallery()).toEqual(['/main.png', '/back.png']);
    expect(component.image()).toBe('/main.png');
  });

  it('reloads when the route points at another product', () => {
    load();

    params.next(convertToParamMap({ slug: 'rain-umbrella' }));
    httpMock.expectOne(productUrl('rain-umbrella')).flush(umbrella());
    fixture.detectChanges();

    expect(component.product()?.slug).toBe('rain-umbrella');
    expect(component.quantity()).toBe(1);
  });
});
