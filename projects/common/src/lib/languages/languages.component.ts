import { Component, DOCUMENT, LOCALE_ID, inject } from '@angular/core';
import { IGX_DROP_DOWN_DIRECTIVES, ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IgxButtonDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { GLOBAL_OVERLAY_SETTINGS } from 'bellum-gens-common/models';
import { PAGE_LOCATION } from 'bellum-gens-common/services';
import { LANGUAGES, LOCALE_CODES, LOCALE_COOKIE } from './languages';

const LOCALE_PREFIX = new RegExp(`^/(${LOCALE_CODES.join('|')})(/|$)`);
const ONE_YEAR = 60 * 60 * 24 * 365;

@Component({
  selector: 'bg-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
  imports: [
    IgxButtonDirective,
    IgxRippleDirective,
    IgxToggleActionDirective,
    IgxIconComponent,
    IGX_DROP_DOWN_DIRECTIVES
  ]
})
export class LanguagesComponent {
  private document = inject(DOCUMENT);
  public localeId = inject(LOCALE_ID);
  private location = inject(PAGE_LOCATION);

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public languageList = LANGUAGES;

  // Runs for mouse and keyboard (Enter/Space) selection alike.
  public selectLanguage(event: ISelectionEventArgs) {
    // Keep the current locale marked while the page reloads in the new one.
    event.cancel = true;
    this.changeLocale(event.newSelection.value);
  }

  public changeLocale(lang: string) {
    // Remember the choice, so the server sends later visits without a locale in the URL to this language
    // instead of the one the browser asks for.
    this.document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=${ONE_YEAR}; samesite=lax`;

    let path = this.location.pathname;
    if (LOCALE_PREFIX.test(path)) {
      path = path.replace(LOCALE_PREFIX, `/${lang}/`);
    } else {
      path = `/${lang}${path}`;
    }
    this.location.href = this.location.origin + path;
  }
}
