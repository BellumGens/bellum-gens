import { Component, LOCALE_ID, inject } from '@angular/core';
import { IGX_DROP_DOWN_DIRECTIVES, ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IgxButtonDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { GLOBAL_OVERLAY_SETTINGS } from 'bellum-gens-common/models';
import { PAGE_LOCATION } from 'bellum-gens-common/services';

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
  private location = inject(PAGE_LOCATION);

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public languageList = [
    { code: 'en', label: 'English' },
    { code: 'bg', label: 'Български' }
  ];

  // Runs for mouse and keyboard (Enter/Space) selection alike.
  public selectLanguage(event: ISelectionEventArgs) {
    // Keep the current locale marked while the page reloads in the new one.
    event.cancel = true;
    this.changeLocale(event.newSelection.value);
  }

  public changeLocale(lang: string) {
    let path = this.location.pathname;
    const pattern = /\/(en|bg)\/?/;
    if (path.match(pattern)) {
      path = path.replace(pattern, `/${lang}/`);
    } else {
      path = `/${lang}${path}`;
    }
    this.location.href = this.location.origin + path;
  }
}


