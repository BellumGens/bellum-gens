import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductEditorComponent } from './product-editor.component';
import { ApiShopService } from '../../../../services/bellumgens-api.shop.service';
import { Brand, JerseyCut, JerseySize, Product, ProductType } from '../../../../models/shop';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

const umbrella = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Rain Umbrella',
  slug: 'rain-umbrella',
  description: 'Keeps you dry',
  type: ProductType.Umbrella,
  brand: Brand.BellumGens,
  price: 15,
  imageUrl: '/umbrella.png',
  galleryUrls: ['/umbrella-open.png'],
  stockQuantity: 4,
  active: true,
  sortOrder: 2,
  variants: [],
  ...overrides
});

const jersey = (): Product => ({
  id: 'jersey',
  name: 'EBL Jersey',
  slug: 'ebl-jersey',
  type: ProductType.Jersey,
  brand: Brand.EBLeague,
  price: 30,
  galleryUrls: [],
  active: true,
  sortOrder: 1,
  variants: [
    { id: 'v2', name: 'Female / M', cut: JerseyCut.Female, size: JerseySize.M, stockQuantity: 2, active: true, sortOrder: 2 },
    { id: 'v1', name: 'Male / L', cut: JerseyCut.Male, size: JerseySize.L, stockQuantity: 5, active: true, sortOrder: 1 }
  ]
});

describe('ProductEditorComponent', () => {
  let fixture: ComponentFixture<ProductEditorComponent>;
  let component: ProductEditorComponent;
  let httpMock: HttpTestingController;
  let api: ApiShopService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditorComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  const productsUrl = () => `${api['_apiEndpoint']}/shopadmin/products`;

  const load = (products: Product[] = [umbrella(), jersey()]) => {
    httpMock.expectOne(productsUrl()).flush(products);
    fixture.detectChanges();
  };

  it('lists the catalog it loads on creation', () => {
    load();

    expect(component.loading()).toBe(false);
    expect(component.products().length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('igx-list-item').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Rain Umbrella');
  });

  it('stops loading when the catalog cannot be fetched', () => {
    httpMock.expectOne(productsUrl()).flush('', { status: 500, statusText: 'Server Error' });

    expect(component.loading()).toBe(false);
    expect(component.products().length).toBe(0);
  });

  it('starts on a blank new product', () => {
    load();

    expect(component.isNew()).toBe(true);
    expect(component.form.controls.name.value).toBe('');
    expect(component.hasVariants).toBe(false);
  });

  it('loads a product into the form, variants ordered by sort order', () => {
    load();

    component.edit(jersey());

    expect(component.isNew()).toBe(false);
    expect(component.form.controls.name.value).toBe('EBL Jersey');
    expect(component.form.controls.slug.value).toBe('ebl-jersey');
    expect(component.form.controls.brand.value).toBe(Brand.EBLeague);
    expect(component.variants.length).toBe(2);
    expect(component.variants.controls.map(v => v.controls.name.value)).toEqual(['Male / L', 'Female / M']);
  });

  it('joins the gallery URLs into one editable field', () => {
    load();

    component.edit(umbrella({ galleryUrls: ['/a.png', '/b.png'] }));

    expect(component.form.controls.galleryUrls.value).toBe('/a.png\n/b.png');
  });

  it('clears the form when starting another new product', () => {
    load();
    component.edit(jersey());

    component.newProduct();

    expect(component.isNew()).toBe(true);
    expect(component.variants.length).toBe(0);
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.sortOrder.value).toBe(2);
  });

  it('adds and removes option rows', () => {
    load();

    component.addVariant();
    component.addVariant();
    expect(component.variants.length).toBe(2);

    component.removeVariant(0);
    expect(component.variants.length).toBe(1);
  });

  it('generates the usual jersey size matrix', () => {
    load();

    component.generateJerseySizes();

    expect(component.variants.length).toBe(11);
    const male = component.variants.controls.filter(v => v.controls.cut.value === JerseyCut.Male);
    const female = component.variants.controls.filter(v => v.controls.cut.value === JerseyCut.Female);
    expect(male.length).toBe(6);
    expect(female.length).toBe(5);
    expect(female.map(v => v.controls.size.value)).toContain(JerseySize.XS);
    expect(male.map(v => v.controls.size.value)).not.toContain(JerseySize.XS);
  });

  it('does not duplicate sizes that already exist', () => {
    load();
    component.edit(jersey());

    component.generateJerseySizes();

    expect(component.variants.length).toBe(11);
    const maleL = component.variants.controls.filter(v =>
      v.controls.cut.value === JerseyCut.Male && v.controls.size.value === JerseySize.L);
    expect(maleL.length).toBe(1);
    expect(maleL[0].controls.id.value).toBe('v1');
  });

  it('refuses to save a product without a name', () => {
    load();

    component.save();

    httpMock.expectNone(productsUrl());
    expect(component.form.touched).toBe(true);
    expect(component.saving()).toBe(false);
  });

  it('refuses to save a negative price', () => {
    load();
    component.form.patchValue({ name: 'Pen', price: -1 });

    component.save();

    httpMock.expectNone(productsUrl());
  });

  it('posts a new product and normalizes the empty optional fields', () => {
    load();
    component.form.patchValue({
      name: '  Pen and Highlighter  ',
      slug: '',
      description: '  ',
      type: ProductType.Pen,
      brand: Brand.BGEStaraZagora,
      price: 4.5,
      discountPercentage: null,
      imageUrl: '',
      galleryUrls: ' /a.png \n\n /b.png ',
      stockQuantity: 12,
      active: true,
      sortOrder: 3
    });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'POST' && r.url === productsUrl());
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body.name).toBe('Pen and Highlighter');
    expect(req.request.body.slug).toBe('');
    expect(req.request.body.description).toBeNull();
    expect(req.request.body.imageUrl).toBeNull();
    expect(req.request.body.discountPercentage).toBeNull();
    expect(req.request.body.galleryUrls).toEqual(['/a.png', '/b.png']);
    expect(req.request.body.stockQuantity).toBe(12);
    expect(req.request.body.variants).toEqual([]);

    req.flush(umbrella({ id: 'new', name: 'Pen and Highlighter' }));
    load([umbrella({ id: 'new', name: 'Pen and Highlighter' })]);

    expect(component.saving()).toBe(false);
    expect(component.selectedId()).toBe('new');
  });

  it('puts an existing product and maps its options', () => {
    load();
    component.edit(jersey());
    component.variants.controls[0].patchValue({ name: '  ', stockQuantity: 7 });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === `${productsUrl()}/jersey`);
    expect(req.request.body.variants.length).toBe(2);
    // A blank name falls back to the cut and size, and the row order becomes the sort order.
    expect(req.request.body.variants[0].name).toBe('Male / L');
    expect(req.request.body.variants[0].stockQuantity).toBe(7);
    expect(req.request.body.variants[0].sortOrder).toBe(0);
    expect(req.request.body.variants[1].sortOrder).toBe(1);
    // Product level stock is meaningless once the product has options.
    expect(req.request.body.stockQuantity).toBeNull();

    req.flush(jersey());
    load();
  });

  it('sends a placeholder id for a brand new option', () => {
    load();
    component.form.patchValue({ name: 'Bracelet', price: 5 });
    component.addVariant();
    component.variants.controls[0].patchValue({ name: 'One size' });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'POST' && r.url === productsUrl());
    expect(req.request.body.variants[0].id).toBe(EMPTY_GUID);
    expect(req.request.body.variants[0].cut).toBeNull();
    expect(req.request.body.variants[0].size).toBeNull();
    expect(req.request.body.variants[0].sku).toBeNull();
    expect(req.request.body.variants[0].priceOverride).toBeNull();

    req.flush(umbrella());
    load();
  });

  it('stops saving when the API rejects the product', () => {
    load();
    component.form.patchValue({ name: 'Pen', price: 1 });

    component.save();
    httpMock.expectOne(r => r.method === 'POST').flush('The product could not be saved. Is the slug unique?',
      { status: 409, statusText: 'Conflict' });

    expect(component.saving()).toBe(false);
  });

  it('asks for confirmation before deleting', () => {
    load();
    component.edit(umbrella());
    const open = vi.spyOn(component.confirm, 'open');

    component.askDelete();

    expect(open).toHaveBeenCalledWith('p1');
  });

  it('does not ask for confirmation for an unsaved product', () => {
    load();
    const open = vi.spyOn(component.confirm, 'open');

    component.askDelete();

    expect(open).not.toHaveBeenCalled();
  });

  it('deletes a product, clears the form and reloads the list', () => {
    load();
    component.edit(umbrella());

    component.delete('p1');

    const req = httpMock.expectOne(r => r.method === 'DELETE' && r.url === `${productsUrl()}/p1`);
    req.flush({ id: 'p1', deactivated: false });
    load([jersey()]);

    expect(component.isNew()).toBe(true);
    expect(component.products().map(p => p.id)).toEqual(['jersey']);
  });

  it('uploads an image and stores the returned URL on the product', async () => {
    load();
    component.edit(umbrella());
    const file = new File(['fake-png-bytes'], 'umbrella.png', { type: 'image/png' });
    const input = { files: [file], value: 'umbrella.png' } as unknown as HTMLInputElement;

    component.upload({ target: input } as unknown as Event);

    await vi.waitUntil(() => component.uploading(), { timeout: 2000 });
    const req = httpMock.expectOne(`${productsUrl()}/p1/image`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.image).toContain('base64');
    req.flush({ url: 'https://blob.example.com/shop/umbrella.png' });
    load();

    expect(component.uploading()).toBe(false);
    expect(component.form.controls.imageUrl.value).toBe('https://blob.example.com/shop/umbrella.png');
  });

  it('ignores an upload before the product is saved', () => {
    load();
    const file = new File(['x'], 'x.png', { type: 'image/png' });

    component.upload({ target: { files: [file], value: '' } as unknown as HTMLInputElement } as unknown as Event);

    expect(component.uploading()).toBe(false);
    httpMock.expectNone(r => r.url.endsWith('/image'));
  });

  it('ignores an upload with no file chosen', () => {
    load();
    component.edit(umbrella());

    component.upload({ target: { files: [], value: '' } as unknown as HTMLInputElement } as unknown as Event);

    expect(component.uploading()).toBe(false);
  });

  it('names an option after its cut and size, or calls it the default', () => {
    load();

    expect(component.variantName(JerseyCut.Male, JerseySize.XXL)).toBe('Male / XXL');
    expect(component.variantName(component.none, JerseySize.M)).toBe('M');
    expect(component.variantName(JerseyCut.Female, component.none)).toBe('Female');
    expect(component.variantName(component.none, component.none)).toBe('Default');
  });
});
