import { Component } from '@angular/core';
import { SearchResult } from '../../../../src-common/models/searchresult';
import { IgxIconService } from '@infragistics/igniteui-angular';
import { ApiSearchService } from '../../../../src-common/services/bellumgens-api.search.service';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent {
  public searchResult: SearchResult = { steamUser: null, players: [], teams: [], strategies: [] };
  public loading = false;
  public term = '';

  constructor(private apiService: ApiSearchService, private iconService: IgxIconService) {
    this.apiService.searchResult.subscribe(data => {
      if (data) {
        this.searchResult = data;
      }
    });
    this.apiService.loadingQuickSearch.subscribe(data => this.loading = data);
    this.apiService.searchTerm.subscribe(term => this.term = term);
    this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
  }

}
