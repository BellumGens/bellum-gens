import { Component } from '@angular/core';
import { SearchResult, ApiSearchService } from '../../../../../common/src/public_api';
import { IgxIconService } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss']
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
