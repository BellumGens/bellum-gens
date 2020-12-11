import { Component } from '@angular/core';

enum SearchType {
  None,
  Player,
  Team
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  public searchType = SearchType.None;

  constructor() {
  }
}
