import { Component } from '@angular/core';
import { ApplicationUser, LoginService } from '../../../../../common/src/public_api';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { NgIf } from '@angular/common';
import { IgxButtonGroupModule, IgxButtonModule, IgxRippleModule } from '@infragistics/igniteui-angular';

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
    imports: [IgxButtonGroupModule, IgxButtonModule, IgxRippleModule, NgIf, PlayerSearchComponent, TeamSearchComponent]
})
export class SearchComponent {
  public searchType = SearchType.None;
  public authUser: ApplicationUser;

  constructor(private authManager: LoginService) {
    this.authManager.applicationUser.subscribe(user => this.authUser = user);
  }
}
