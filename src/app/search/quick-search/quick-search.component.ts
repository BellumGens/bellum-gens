import { Component } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { SearchResult } from '../../models/searchresult';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent extends BaseComponent {
  public searchResult: SearchResult = {Players: [], Teams: []};
  public loading = false;
  public term = '';

  constructor(private apiService: BellumgensApiService) {
    super();
    this.subs.push(this.apiService.searchResult.subscribe(data => this.searchResult = data));
    this.subs.push(this.apiService.loadingQuickSearch.subscribe(data => this.loading = data));
    this.subs.push(this.apiService.searchTerm.subscribe(term => this.term = term));
  }

}
