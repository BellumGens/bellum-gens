import { Directive } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Directive({
    standalone: true
})
export class BaseDirective {

  private _title = 'Bellum Gens: Premier Gaming and Esports Events Organizer';
  private _twitterTitle = 'Bellum Gens: Premier Gaming and Esports Events Organizer';
  // eslint-disable-next-line max-len
  private _description = 'Bellum Gens is a premier gaming and esports events organizer in Bulgaria and the Balkans region. If you want to tap into esports we can help!';
  private _twitterDescription = 'Bellum Gens is a premier gaming and esports events organizer in Bulgaria and the Balkans region.';
  private _image = '/assets/avatar_BG_blood.png';

  constructor(protected titleService: Title,
              protected meta: Meta,
              protected activeRoute: ActivatedRoute) {
    this.activeRoute.data.subscribe(data => {
      this.titleService.setTitle(data.title || this._title);
      this.meta.updateTag({ name: 'description', content: data.description || this._description});
      this.meta.updateTag({ name: 'twitter:title', content: data.twitterTitle || this._twitterTitle});
      this.meta.updateTag({ name: 'twitter:description', content: data.twitterDescription || this._twitterDescription});
      this.meta.updateTag({ name: 'og:image', content: data.image || this._image });
      this.meta.updateTag({ name: 'twitter:image', content: data.image || this._image });
    });
  }

}
