import { Component, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../src-bellumgens/app/base/base.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent extends BaseComponent {
  public horizontal = window ? window.matchMedia('(min-width: 768px)').matches : true;

  constructor(title: Title, meta: Meta, route: ActivatedRoute) {
    super(title, meta, route);
  }

  @HostListener('window:resize')
  public resize() {
    this.horizontal = window.matchMedia('(min-width: 768px)').matches;
  }

}
