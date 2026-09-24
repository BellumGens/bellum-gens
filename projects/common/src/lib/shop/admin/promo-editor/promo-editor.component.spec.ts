import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PromoEditorComponent } from './promo-editor.component';
import { ApiShopService } from '../../../../services/bellumgens-api.shop.service';
import { Brand, Promo } from '../../../../models/shop';

const promo = (overrides: Partial<Promo> = {}): Promo => ({
  code: 'SAVE10',
  discount: 0.1,
  active: true,
  timesUsed: 3,
  ...overrides
});

describe('PromoEditorComponent', () => {
  let fixture: ComponentFixture<PromoEditorComponent>;
  let component: PromoEditorComponent;
  let httpMock: HttpTestingController;
  let api: ApiShopService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoEditorComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(PromoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  const promosUrl = () => `${api['_apiEndpoint']}/shopadmin/promos`;

  const load = (promos: Promo[] = [promo()]) => {
    httpMock.expectOne(promosUrl()).flush(promos);
    fixture.detectChanges();
  };

  it('lists the promo codes it loads on creation', () => {
    load([promo(), promo({ code: 'BGE50', discount: 0.5, active: false, timesUsed: 0 })]);

    expect(component.promos().length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('SAVE10');
    expect(fixture.nativeElement.textContent).toContain('Inactive');
  });

  it('shows an empty state with no codes', () => {
    load([]);

    expect(fixture.nativeElement.textContent).toContain('No promo codes yet');
  });

  it('shows the usage counter and the expiry date', () => {
    load([promo({ usageLimit: 10, expiration: '2026-12-31T00:00:00Z' })]);

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('3');
    expect(text).toContain('10');
    expect(text).toContain('Dec');
  });

  it('starts on a blank new code with the code field editable', () => {
    load();

    expect(component.editing()).toBeNull();
    expect(component.form.controls.code.enabled).toBe(true);
    expect(component.form.controls.discountPercent.value).toBe(10);
    expect(component.form.controls.brand.value).toBe(component.anyBrand);
  });

  it('loads a code as a percentage and locks the code itself', () => {
    load();

    component.edit(promo({ discount: 0.155, usageLimit: 5, minimumOrderTotal: 40, brand: Brand.EBLeague, expiration: '2026-12-31T00:00:00Z' }));

    expect(component.form.controls.discountPercent.value).toBe(15.5);
    expect(component.form.controls.usageLimit.value).toBe(5);
    expect(component.form.controls.minimumOrderTotal.value).toBe(40);
    expect(component.form.controls.brand.value).toBe(Brand.EBLeague);
    expect(component.form.controls.expiration.value instanceof Date).toBe(true);
    // The code is the primary key, so it cannot be renamed.
    expect(component.form.controls.code.disabled).toBe(true);
  });

  it('unlocks the code field again for a new code', () => {
    load();
    component.edit(promo());

    component.newPromo();

    expect(component.editing()).toBeNull();
    expect(component.form.controls.code.enabled).toBe(true);
    expect(component.form.controls.code.value).toBe('');
  });

  it('refuses a code with unsupported characters', () => {
    load();
    component.form.patchValue({ code: 'save 10%' });

    component.save();

    httpMock.expectNone(r => r.method === 'POST');
    expect(component.form.controls.code.invalid).toBe(true);
    expect(component.form.touched).toBe(true);
  });

  it('refuses a discount above one hundred percent', () => {
    load();
    component.form.patchValue({ code: 'HALF', discountPercent: 120 });

    component.save();

    httpMock.expectNone(r => r.method === 'POST');
  });

  it('posts a new code in upper case with the discount as a fraction', () => {
    load();
    component.form.patchValue({ code: 'summer26', discountPercent: 15, usageLimit: 100, minimumOrderTotal: 25, brand: Brand.BGEStaraZagora, active: true });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'POST' && r.url === promosUrl());
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body.code).toBe('SUMMER26');
    expect(req.request.body.discount).toBe(0.15);
    expect(req.request.body.usageLimit).toBe(100);
    expect(req.request.body.minimumOrderTotal).toBe(25);
    expect(req.request.body.brand).toBe(Brand.BGEStaraZagora);
    expect(req.request.body.timesUsed).toBe(0);
    expect(req.request.body.expiration).toBeNull();

    req.flush(promo({ code: 'SUMMER26', discount: 0.15, timesUsed: 0 }));
    load([promo({ code: 'SUMMER26', discount: 0.15, timesUsed: 0 })]);

    expect(component.saving()).toBe(false);
    expect(component.editing()?.code).toBe('SUMMER26');
  });

  it('sends no brand restriction when the code applies to everything', () => {
    load();
    component.form.patchValue({ code: 'ALL', discountPercent: 5, brand: component.anyBrand });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'POST');
    expect(req.request.body.brand).toBeNull();
    req.flush(promo({ code: 'ALL', discount: 0.05 }));
    load();
  });

  it('sends the expiry as an ISO timestamp', () => {
    load();
    component.form.patchValue({ code: 'XMAS', discountPercent: 20, expiration: new Date(Date.UTC(2026, 11, 24, 12)) });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'POST');
    expect(req.request.body.expiration).toBe('2026-12-24T12:00:00.000Z');
    req.flush(promo({ code: 'XMAS', discount: 0.2 }));
    load();
  });

  it('puts an existing code and keeps its usage counter', () => {
    load();
    component.edit(promo({ timesUsed: 7 }));
    component.form.patchValue({ discountPercent: 25, active: false });

    component.save();

    const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === `${promosUrl()}/SAVE10`);
    expect(req.request.body.code).toBe('SAVE10');
    expect(req.request.body.discount).toBe(0.25);
    expect(req.request.body.active).toBe(false);
    expect(req.request.body.timesUsed).toBe(7);

    req.flush(promo({ discount: 0.25, active: false, timesUsed: 7 }));
    load();
  });

  it('stops saving when the API rejects a duplicate code', () => {
    load();
    component.form.patchValue({ code: 'SAVE10', discountPercent: 10 });

    component.save();
    httpMock.expectOne(r => r.method === 'POST').flush('This promo code already exists.', { status: 409, statusText: 'Conflict' });

    expect(component.saving()).toBe(false);
  });

  it('asks for confirmation before deleting a code', () => {
    load();
    const open = vi.spyOn(component.confirm, 'open');

    component.askDelete(promo());

    expect(open).toHaveBeenCalledWith('SAVE10');
  });

  it('deletes a code and reloads the list', () => {
    load();

    component.delete('SAVE10');

    httpMock.expectOne(r => r.method === 'DELETE' && r.url === `${promosUrl()}/SAVE10`).flush({ code: 'SAVE10', deactivated: false });
    load([]);

    expect(component.promos().length).toBe(0);
  });

  it('clears the form when the code being edited is deleted', () => {
    load();
    component.edit(promo());

    component.delete('SAVE10');

    httpMock.expectOne(r => r.method === 'DELETE').flush({ code: 'SAVE10', deactivated: true });
    load([]);

    expect(component.editing()).toBeNull();
    expect(component.form.controls.code.enabled).toBe(true);
  });

  it('keeps editing a different code when another one is deleted', () => {
    load([promo(), promo({ code: 'OTHER' })]);
    component.edit(promo());

    component.delete('OTHER');

    httpMock.expectOne(r => r.method === 'DELETE').flush({ code: 'OTHER', deactivated: false });
    load([promo()]);

    expect(component.editing()?.code).toBe('SAVE10');
  });
});
