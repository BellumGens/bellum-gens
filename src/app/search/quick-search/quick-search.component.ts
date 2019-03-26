import { Component, OnInit } from '@angular/core';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { SearchResult } from '../../models/searchresult';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {
  public searchResult: SearchResult = {Players: [], Teams: []};
  public loading = false;
  public term = '';

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
    this.apiService.searchResult.subscribe(data => this.searchResult = data);
    this.apiService.loadingQuickSearch.subscribe(data => this.loading = data);
    this.apiService.searchTerm.subscribe(term => this.term = term);
  }

}
