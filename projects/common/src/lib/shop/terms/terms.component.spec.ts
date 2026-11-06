import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TermsComponent } from './terms.component';

describe('TermsComponent', () => {
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    fixture.detectChanges();
  });

  it('explains the 14-day right of withdrawal and how to use it', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Right of withdrawal');
    expect(text).toContain('within 14 days of receiving the goods');
    expect(text).toContain('info@bellumgens.com');
  });

  it('links back to the shop', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/shop');
  });
});
