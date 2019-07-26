import { Component } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { CSGOStrategy } from '../../../models/csgostrategy';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.css']
})
export class StrategyDetailsComponent extends BaseComponent {

  public strat: CSGOStrategy;

  constructor(private apiService: BellumgensApiService,
              private route: ActivatedRoute) {
    super();
    this.subs.push(
      this.route.params.subscribe(params => {
        const stratid = params['stratid'];
        if (stratid) {
          this.apiService.getCurrentStrategy(stratid).subscribe(strat => {
            if (strat) {
              this.strat = strat;
            }
          });
        }
      })
    );
  }

}
