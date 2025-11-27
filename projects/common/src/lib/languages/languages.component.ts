
import { Component, LOCALE_ID, inject } from '@angular/core';
import {
  IGX_DROP_DOWN_DIRECTIVES,
  IgxButtonDirective,
  IgxIconComponent,
  IgxRippleDirective,
  IgxToggleActionDirective
} from '@infragistics/igniteui-angular';
import { GLOBAL_OVERLAY_SETTINGS } from '../../models/misc';

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
  public localeId = inject(LOCALE_ID);

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public languageList = [
    { code: 'en', label: 'English' },
    { code: 'bg', label: 'Български' }
  ];

  public changeLocale(lang: string) {
    let path = window.location.pathname;
    const pattern = /\/(en|bg)\/?/;
    if (path.match(pattern)) {
      path = path.replace(pattern, `/${lang}/`);
    } else {
      path = `/${lang}${path}`;
    }
    window.location.href = window.location.origin + path;
  }
}


