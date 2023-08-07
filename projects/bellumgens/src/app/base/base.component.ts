import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
    template: ``,
    styleUrls: ['./base.component.css'],
    standalone: true
})
export class BaseComponent implements OnDestroy {
  protected subs: Subscription [] = [];

  private _title = 'Bellum Gens: Premier Gaming and Esports Events Organizer';
  private _twitterTitle = 'Bellum Gens: Premier Gaming and Esports Events Organizer';
  // eslint-disable-next-line max-len
  private _description = 'Bellum Gens is a premier gaming and esports events organizer in Bulgaria and the Balkans region. If you want to tap into esports we can help!';
  private _twitterDescription = 'Bellum Gens is a premier gaming and esports events organizer in Bulgaria and the Balkans region.';
  private _image = '/assets/avatar_BG_blood.png';
  private data: Data;

  constructor(protected titleService: Title,
              protected meta: Meta,
              protected activeRoute: ActivatedRoute) {
    this.subs.push(this.activeRoute.data.subscribe(data => {
      this.data = data;
      this.titleService.setTitle(this.data.title || this._title);
      this.meta.updateTag({ name: 'description', content: this.data.description || this._description});
      this.meta.updateTag({ name: 'twitter:title', content: this.data.twitterTitle || this._twitterTitle});
      this.meta.updateTag({ name: 'twitter:description', content: this.data.twitterDescription || this._twitterDescription});
      this.meta.updateTag({ name: 'og:image', content: this.data.image || this._image });
      this.meta.updateTag({ name: 'twitter:image', content: this.data.image || this._image });
    }));
  }

  public ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
