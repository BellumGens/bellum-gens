import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerComponent } from './partner.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PartnerComponent', () => {
  let component: PartnerComponent;
  let fixture: ComponentFixture<PartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerComponent, NoopAnimationsModule],
      providers: [
        Title,
        Meta,
        { provide: ActivatedRoute, useValue: { data: of({
          social: [{ name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' }],
          partnerImage: 'image.jpg',
          name: 'Partner Name',
          url: 'https://partner.com',
          expose: ['info1', 'info2']
        }) }},
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data from route', () => {
    expect(component.social).toEqual([{ name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' }]);
    expect(component.image).toBe('image.jpg');
    expect(component.name).toBe('Partner Name');
    expect(component.url).toBe('https://partner.com');
    expect(component.expose).toEqual(['info1', 'info2']);
  });

  it('should set horizontal to true if window width is >= 1024px', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    component.resize();
    expect(component.horizontal).toBe(true);
    expect(component.mediaWidth).toBe('550px');
  });

  it('should set horizontal to false if window width is < 1024px', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    component.resize();
    expect(component.horizontal).toBe(false);
    expect(component.mediaWidth).toBe('100%');
  });

  it('should call resize on window resize event', () => {
    vi.spyOn(component, 'resize').mockImplementation(() => undefined);
    window.dispatchEvent(new Event('resize'));
    expect(component.resize).toHaveBeenCalled();
  });
});
