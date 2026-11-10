import { BannerResourceStringsEN, changei18n, getCurrentResourceStrings } from '@infragistics/igniteui-angular/core';
import { IgxResourceStringsDE, IgxResourceStringsRO } from 'igniteui-angular-i18n';
import { localizeIgniteUI } from './igx-resource-strings';

describe('localizeIgniteUI', () => {
  afterEach(() => changei18n(BannerResourceStringsEN));

  it('should switch the components to the strings of a supported locale', () => {
    localizeIgniteUI('de');
    expect(getCurrentResourceStrings(BannerResourceStringsEN).igx_banner_button_dismiss)
      .toBe(IgxResourceStringsDE.igx_banner_button_dismiss);

    localizeIgniteUI('ro');
    expect(getCurrentResourceStrings(BannerResourceStringsEN).igx_banner_button_dismiss)
      .toBe(IgxResourceStringsRO.igx_banner_button_dismiss);
  });

  it('should keep the English strings for the source locale', () => {
    localizeIgniteUI('en');
    expect(getCurrentResourceStrings(BannerResourceStringsEN).igx_banner_button_dismiss)
      .toBe(BannerResourceStringsEN.igx_banner_button_dismiss);
  });
});
