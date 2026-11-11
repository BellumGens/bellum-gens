import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShopSettingsEditorComponent } from './settings-editor.component';
import { ApiShopService, CommunicationService } from 'bellum-gens-common/services';
import { ShopSettings } from 'bellum-gens-common/models';

const settings = (overrides: Partial<ShopSettings> = {}): ShopSettings => ({
  shippingCost: 6,
  freeShippingThreshold: 50,
  maxQuantityPerLine: 10,
  updatedOn: '2026-11-10T10:00:00+02:00',
  ...overrides
});

describe('ShopSettingsEditorComponent', () => {
  let fixture: ComponentFixture<ShopSettingsEditorComponent>;
  let component: ShopSettingsEditorComponent;
  let httpMock: HttpTestingController;
  let api: ApiShopService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopSettingsEditorComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiShopService);
    fixture = TestBed.createComponent(ShopSettingsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  const settingsUrl = () => `${api['_apiEndpoint']}/shopadmin/settings`;

  const load = (loaded: ShopSettings = settings()) => {
    httpMock.expectOne(r => r.method === 'GET' && r.url === settingsUrl()).flush(loaded);
    fixture.detectChanges();
  };

  const saveButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button[type="submit"]');

  it('loads the settings into the form on creation', () => {
    load(settings({ shippingCost: 4.5, freeShippingThreshold: 80, maxQuantityPerLine: 5 }));

    expect(component.form.getRawValue()).toEqual({ shippingCost: 4.5, freeShippingThreshold: 80, maxQuantityPerLine: 5 });
    expect(fixture.nativeElement.textContent).toContain('Last changed');
  });

  it('keeps saving disabled until the settings are loaded and changed', () => {
    expect(saveButton().disabled).toBe(true);

    load();
    expect(saveButton().disabled).toBe(true);

    component.form.controls.shippingCost.setValue(7);
    component.form.markAsDirty();
    fixture.detectChanges();
    expect(saveButton().disabled).toBe(false);
  });

  it('saves the edited values as numbers and shows the saved settings', () => {
    load();
    const success = vi.spyOn(TestBed.inject(CommunicationService), 'emitSuccess');
    component.form.setValue({ shippingCost: '7.5' as unknown as number, freeShippingThreshold: 60, maxQuantityPerLine: 3 });

    component.save();
    expect(component.saving()).toBe(true);
    const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === settingsUrl());
    expect(req.request.body).toEqual({ shippingCost: 7.5, freeShippingThreshold: 60, maxQuantityPerLine: 3 });
    req.flush(settings({ shippingCost: 7.5, freeShippingThreshold: 60, maxQuantityPerLine: 3, updatedBy: 'admin1' }));

    expect(component.saving()).toBe(false);
    expect(component.settings()?.updatedBy).toBe('admin1');
    expect(component.form.pristine).toBe(true);
    expect(success).toHaveBeenCalled();
  });

  it('does not send settings outside the accepted limits', () => {
    load();

    component.form.controls.shippingCost.setValue(-1);
    component.save();
    component.form.controls.shippingCost.setValue(6);
    component.form.controls.maxQuantityPerLine.setValue(0);
    component.save();
    component.form.controls.maxQuantityPerLine.setValue(2.5);
    component.save();
    component.form.controls.maxQuantityPerLine.setValue(101);
    component.save();
    fixture.detectChanges();

    expect(component.form.touched).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Enter a whole number between 1 and 100');
  });

  it('keeps the edited values when saving fails', () => {
    load();
    const error = vi.spyOn(TestBed.inject(CommunicationService), 'emitError');
    component.form.controls.freeShippingThreshold.setValue(70);

    component.save();
    httpMock.expectOne(r => r.method === 'PUT' && r.url === settingsUrl())
      .flush('The field FreeShippingThreshold is invalid.', { status: 400, statusText: 'Bad Request' });

    expect(component.saving()).toBe(false);
    expect(component.form.controls.freeShippingThreshold.value).toBe(70);
    expect(error).toHaveBeenCalledWith('The field FreeShippingThreshold is invalid.');
  });
});
