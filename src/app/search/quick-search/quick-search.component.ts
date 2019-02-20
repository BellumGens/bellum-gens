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
  public loading = true;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
    this.apiService.searchResult.subscribe(data => this.searchResult = data);
    this.apiService.loadingQuickSearch.subscribe(data => this.loading = data);
  }

}
