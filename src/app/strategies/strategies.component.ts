import { Component } from '@angular/core';
import { CSGOStrategy } from '../models/csgoteamstrategy';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css']
})
export class StrategiesComponent extends BaseComponent {

  public strats: CSGOStrategy [];
  public loading = true;

  constructor(private apiServer: BellumgensApiService) {
    super();
    this.subs.push(
      this.apiServer.loadingStrategies.subscribe(loading => this.loading = loading),
      this.apiServer.strategies.subscribe(strats => this.strats = strats)
    );
  }

}
