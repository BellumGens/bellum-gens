import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-base',
  template: ``,
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnDestroy {

  constructor() { }

  protected subs: Subscription [] = [];

  public ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
