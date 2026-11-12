import { Component, Signal, inject, signal } from '@angular/core';
import { ApplicationUser } from 'bellum-gens-common/models';
import { LoginService } from 'bellum-gens-common/services';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { PlayerSearchComponent } from '../player-search/player-search.component';

import { IGX_BUTTON_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/button-group';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';

enum SearchType {
  None,
  Player,
  Team
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],  imports: [
    IGX_BUTTON_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    PlayerSearchComponent,
    TeamSearchComponent
  ]
})
export class SearchComponent {
  private authManager = inject(LoginService);

  public searchType = signal<SearchType>(SearchType.None);
  public authUser: Signal<ApplicationUser | null> = this.authManager.applicationUser;
}
