import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ShopComponent } from './shop.component';

describe('ShopComponent', () => {
  let fixture: ComponentFixture<ShopComponent>;
  let component: ShopComponent;

  const createWith = async (data: Record<string, string> = {}) => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ShopComponent],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { data: of(data) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', async () => {
    await createWith();

    expect(component).toBeTruthy();
  });

  it('hosts the shop pages in a router outlet', async () => {
    await createWith();

    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });

  it('applies the SEO metadata from the route', async () => {
    await createWith({
      title: 'Bellum Gens Shop: Official Merchandise',
      twitterTitle: 'Bellum Gens Shop',
      description: 'Official merchandise',
      twitterDescription: 'Official merchandise',
      image: '/assets/shop.png'
    });

    expect(TestBed.inject(Title).getTitle()).toBe('Bellum Gens Shop: Official Merchandise');
    const meta = TestBed.inject(Meta);
    expect(meta.getTag('name="description"')?.content).toBe('Official merchandise');
    expect(meta.getTag('name="twitter:title"')?.content).toBe('Bellum Gens Shop');
    expect(meta.getTag('name="og:image"')?.content).toBe('/assets/shop.png');
  });

  it('falls back to the site defaults when the route carries no metadata', async () => {
    await createWith();

    expect(TestBed.inject(Title).getTitle()).toContain('Bellum Gens');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toContain('Bellum Gens');
  });
});
