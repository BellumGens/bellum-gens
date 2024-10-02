import { Component } from '@angular/core';
import { ApplicationUser, LoginService } from '../../../../../common/src/public_api';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { PlayerSearchComponent } from '../player-search/player-search.component';

import { IGX_BUTTON_GROUP_DIRECTIVES, IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular';

enum SearchType {
  None,
  Player,
  Team
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [
    IGX_BUTTON_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    PlayerSearchComponent,
    TeamSearchComponent
  ]
})
export class SearchComponent {
  public searchType = SearchType.None;
  public authUser: ApplicationUser;

  constructor(private authManager: LoginService) {
    this.authManager.applicationUser.subscribe(user => this.authUser = user);
  }
}
