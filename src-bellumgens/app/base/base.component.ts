import { Component, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-base',
  template: ``,
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnDestroy {
  private _title = 'Bellum Gens: CS:GO team management';
  private _twitterTitle = 'CS:GO Strategy editor & community for team search and management.';
  // tslint:disable-next-line:max-line-length
  private _description = 'CSGO Strategy editor | CSGO team finding and management | Bellum Gens: Looking for Group | Esports Business League';
  private _twitterDescription = 'CS:GO Strategy editor & strategy sharing with the community. CS:GO team management platform.';
  private _headerTitle = 'Bellum Gens';
  private _headerTitleShort = '';
  private _image = '/assets/avatar_BG_blood.png';
  private data: Data;
  public title: string;

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
      if (isPlatformBrowser(PLATFORM_ID)) {
        this.title = window.matchMedia('(min-width: 768px)').matches ?
                                this.data.headerTitle || this._headerTitle :
                                this.data.headerTitleShort || this._headerTitleShort;
      } else {
        this.title = this.data.headerTitle || this._headerTitle;
      }
    }));
  }

  protected subs: Subscription [] = [];

  @HostListener('window:resize')
  public resize() {
    this.title = window.matchMedia('(min-width: 768px)').matches ?
                    this.data.headerTitle || this._headerTitle :
                    this.data.headerTitleShort || this._headerTitleShort;
  }

  public ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
