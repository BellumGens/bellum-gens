import { Component, Input } from '@angular/core';
import { ApplicationUser } from 'src/app/models/applicationuser';

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

  @Input()
  public authUser: ApplicationUser;

  constructor() {
  }
}
