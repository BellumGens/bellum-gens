import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let component: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        LanguagesComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have language list with English and Bulgarian', () => {
    expect(component.languageList.length).toBe(2);
    expect(component.languageList[0]).toEqual({ code: 'en', label: 'English' });
    expect(component.languageList[1]).toEqual({ code: 'bg', label: 'Български' });
  });

  it('should have overlay settings', () => {
    expect(component.overlaySettings).toBeDefined();
  });

  it('should inject locale ID', () => {
    expect(component.localeId).toBeDefined();
  });

  it('should have changeLocale method', () => {
    expect(component.changeLocale).toBeDefined();
    expect(typeof component.changeLocale).toBe('function');
  });
});
