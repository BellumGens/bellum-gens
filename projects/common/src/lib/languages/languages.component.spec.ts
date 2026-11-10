import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

import { PAGE_LOCATION } from 'bellum-gens-common/services';
import { LanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let component: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;
  let location: { origin: string; pathname: string; href: string };

  const createComponent = (localeId?: string) => {
    if (localeId) {
      TestBed.overrideProvider(LOCALE_ID, { useValue: localeId });
    }
    fixture = TestBed.createComponent(LanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  // The drop down only renders its items while open, inside the overlay attached to the document.
  const openDropDown = async (): Promise<HTMLElement[]> => {
    fixture.nativeElement.querySelector('button.profile-button').click();
    await fixture.whenStable();
    return Array.from(document.querySelectorAll('igx-drop-down-item'));
  };

  beforeEach(async () => {
    // jsdom does not implement navigation, so the location the component reads and writes is stubbed.
    location = { origin: 'http://localhost:4200', pathname: '/', href: 'http://localhost:4200/' };
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        LanguagesComponent
      ],
      providers: [{ provide: PAGE_LOCATION, useFactory: () => location }]
    })
    .compileComponents();
  });

  describe('with the default locale', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should list every supported language, starting with English and Bulgarian', () => {
      expect(component.languageList.map(l => l.code)).toEqual(['en', 'bg', 'de', 'fr', 'nl', 'nb', 'sv', 'pl', 'ro']);
      expect(component.languageList[0]).toEqual({ code: 'en', label: 'English', flag: 'united-kingdom' });
      expect(component.languageList[1]).toEqual({ code: 'bg', label: 'Български', flag: 'bulgaria' });
    });

    it('should have overlay settings', () => {
      expect(component.overlaySettings).toBeDefined();
    });

    it('should inject locale ID', () => {
      expect(component.localeId).toBeDefined();
    });

    it('should render a toggle button showing the current locale icon', () => {
      const icon = fixture.debugElement.query(By.css('button.profile-button')).query(By.directive(IgxIconComponent));
      expect(icon.componentInstance.family).toBe('languages');
      expect(icon.componentInstance.name).toBe(component.localeId);
    });

    it('should give the toggle button an accessible name', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.profile-button');
      expect(button.getAttribute('aria-label')).toBe('Choose a language');
    });

    it('should not render the language items until the drop down is opened', () => {
      expect(document.querySelectorAll('igx-drop-down-item').length).toBe(0);
    });

    it('should render a drop down item per language with its label in its own language', async () => {
      const items = await openDropDown();
      expect(items.length).toBe(9);
      const labels = items.map(item => item.querySelector('span[lang]')!);
      expect(labels.map(l => l.textContent.trim()))
        .toEqual(['English', 'Български', 'Deutsch', 'Français', 'Nederlands', 'Norsk', 'Svenska', 'Polski', 'Română']);
      expect(labels.map(l => l.getAttribute('lang'))).toEqual(['en', 'bg', 'de', 'fr', 'nl', 'nb', 'sv', 'pl', 'ro']);
    });

    it('should prefix the current path with the chosen locale when the path has no locale', async () => {
      location.pathname = '/players/some-player';

      (await openDropDown())[1].click();

      expect(location.href).toBe('http://localhost:4200/bg/players/some-player');
    });

    it('should replace the locale segment of the current path', async () => {
      location.pathname = '/bg/teams/some-team';

      (await openDropDown())[0].click();

      expect(location.href).toBe('http://localhost:4200/en/teams/some-team');
    });

    it('should change the language with the keyboard', async () => {
      location.pathname = '/players/some-player';
      await openDropDown();
      const toggle = fixture.nativeElement.querySelector('button.profile-button') as HTMLButtonElement;
      expect(toggle.getAttribute('aria-haspopup')).toBe('listbox');

      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await fixture.whenStable();

      expect(location.href).toBe('http://localhost:4200/bg/players/some-player');
    });

    it('should replace a trailing locale segment of the current path', () => {
      location.pathname = '/en';

      component.changeLocale('bg');

      expect(location.href).toBe('http://localhost:4200/bg/');
    });

    it('should switch between any of the supported locales', () => {
      location.pathname = '/nb/shop/cart';

      component.changeLocale('ro');

      expect(location.href).toBe('http://localhost:4200/ro/shop/cart');
    });

    it('should only treat a whole first path segment as the locale', () => {
      location.pathname = '/players/en/bgplayer';

      component.changeLocale('de');

      expect(location.href).toBe('http://localhost:4200/de/players/en/bgplayer');
    });

    it('should remember the chosen locale in a cookie for the server', () => {
      component.changeLocale('fr');

      expect(document.cookie).toContain('locale=fr');
    });
  });

  describe('with a selected locale', () => {
    it('should mark the drop down item of the current locale as selected', async () => {
      createComponent('bg');

      expect(component.localeId).toBe('bg');
      const selected = (await openDropDown()).map(item => item.classList.contains('igx-drop-down__item--selected'));
      expect(selected).toEqual([false, true, false, false, false, false, false, false, false]);
    });
  });
});
