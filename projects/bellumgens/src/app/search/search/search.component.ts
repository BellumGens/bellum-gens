import { Component } from '@angular/core';
import { ApplicationUser, LoginService } from '../../../../../common/src/public_api';

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
  public authUser: ApplicationUser;

  constructor(private authManager: LoginService) {
    this.authManager.applicationUser.subscribe(user => this.authUser = user);
  }
}
