import { Component } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { SearchResult } from '../../models/searchresult';
import { BaseComponent } from '../../base/base.component';
import { IgxIconService } from 'igniteui-angular';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent extends BaseComponent {
  public searchResult: SearchResult = {SteamUser: null, Players: [], Teams: [], Strategies: []};
  public loading = false;
  public term = '';

  constructor(private apiService: BellumgensApiService, private iconService: IgxIconService) {
    super();
    this.subs.push(
      this.apiService.searchResult.subscribe(data => {
        this.searchResult = data;
      }),
      this.apiService.loadingQuickSearch.subscribe(data => this.loading = data),
      this.apiService.searchTerm.subscribe(term => this.term = term)
    );
    this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
  }

}
