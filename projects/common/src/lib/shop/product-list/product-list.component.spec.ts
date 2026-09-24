import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductListComponent } from './product-list.component';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { Brand, Product, ProductType } from '../../../models/shop';

const product = (id: string, name: string, brand: Brand, type: ProductType): Product => ({
  id,
  name,
  slug: id,
  type,
  brand,
  price: 15,
  galleryUrls: [],
  active: true,
  sortOrder: 0,
  variants: []
});

const catalog: Product[] = [
  product('p1', 'BG Umbrella', Brand.BellumGens, ProductType.Umbrella),
  product('p2', 'EBL Jersey', Brand.EBLeague, ProductType.Jersey),
  product('p3', 'EBL Pen', Brand.EBLeague, ProductType.Pen),
  product('p4', 'BGE Jersey', Brand.BGEStaraZagora, ProductType.Jersey)
];

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let httpMock: HttpTestingController;
  let api: ApiShopService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  const load = (products: Product[] = catalog) => {
    fixture.detectChanges();
    httpMock.expectOne(`${api['_apiEndpoint']}/shop/products`).flush(products);
    fixture.detectChanges();
  };

  it('shows a spinner until the catalog arrives', () => {
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
    expect(fixture.nativeElement.querySelector('igx-circular-bar')).not.toBeNull();

    httpMock.expectOne(`${api['_apiEndpoint']}/shop/products`).flush(catalog);
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(fixture.nativeElement.querySelector('igx-circular-bar')).toBeNull();
  });

  it('renders a card per product', () => {
    load();

    expect(component.filtered().length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('bg-product-card').length).toBe(4);
  });

  it('offers only the product types present in the catalog', () => {
    load();

    expect(component.types()).toEqual([ProductType.Jersey, ProductType.Umbrella, ProductType.Pen]
      .sort((a, b) => a - b));
  });

  it('filters by brand and clears the filter when the chip is deselected', () => {
    load();

    component.selectBrand(Brand.EBLeague, true);
    expect(component.filtered().map(p => p.id)).toEqual(['p2', 'p3']);

    component.selectBrand(Brand.EBLeague, false);
    expect(component.brand()).toBeNull();
    expect(component.filtered().length).toBe(4);
  });

  it('filters by product type', () => {
    load();

    component.selectType(ProductType.Jersey, true);

    expect(component.filtered().map(p => p.id)).toEqual(['p2', 'p4']);
  });

  it('combines the brand and type filters', () => {
    load();

    component.selectBrand(Brand.EBLeague, true);
    component.selectType(ProductType.Jersey, true);

    expect(component.filtered().map(p => p.id)).toEqual(['p2']);
  });

  it('ignores a deselect for a filter that is no longer active', () => {
    load();
    component.selectBrand(Brand.EBLeague, true);

    component.selectBrand(Brand.BellumGens, false);

    expect(component.brand()).toBe(Brand.EBLeague);
  });

  it('resets the filter when the all chip is selected', () => {
    load();
    component.selectType(ProductType.Pen, true);

    component.selectType(null, true);

    expect(component.type()).toBeNull();
    expect(component.filtered().length).toBe(4);
  });

  it('explains an empty result instead of showing an empty grid', () => {
    load([product('p1', 'BG Umbrella', Brand.BellumGens, ProductType.Umbrella)]);

    component.selectBrand(Brand.EBLeague, true);
    fixture.detectChanges();

    expect(component.filtered().length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Nothing matches this filter yet');
  });

  it('hides the type filter row while the catalog has a single type', () => {
    load([product('p1', 'BG Umbrella', Brand.BellumGens, ProductType.Umbrella)]);

    expect(component.types().length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.shop-filters').length).toBe(1);
  });
});
