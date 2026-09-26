import { Component, Signal, computed, inject, input, signal } from '@angular/core';
import {
  PLAYER_SEARCH,
  PlayerSearch,
  PlaystyleRole,
  ApplicationUser,
  LoginService,
  CSGOTeam
} from '../../../../../common/src/public_api';
import { Router } from '@angular/router';

import { IGX_RADIO_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/radio';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_SLIDER_DIRECTIVES } from '@infragistics/igniteui-angular/slider';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.scss'],  imports: [
    FormsModule,
    IGX_RADIO_GROUP_DIRECTIVES,
    IGX_SELECT_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxAvatarComponent,
    IGX_SLIDER_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective
  ]
})
export class PlayerSearchComponent {
  private router = inject(Router);
  private authManager = inject(LoginService);


  public authUser = input<ApplicationUser>();

  public teamAdmin: Signal<CSGOTeam []> = this.authManager.teamsAdmin;
  public role = signal<PlaystyleRole>(PLAYER_SEARCH.role);
  public scheduleOverlap = signal(PLAYER_SEARCH.scheduleOverlap);
  public teamId = signal<string>(PLAYER_SEARCH.teamId);
  public userOverlap = signal(0);
  public teamName = signal('Select Team');

  // Assembled from the individual field signals so the query builder keeps
  // working against a single object.
  public searchModel = computed<PlayerSearch>(() => ({
    role: this.role(),
    scheduleOverlap: this.scheduleOverlap(),
    teamId: this.teamId()
  }));

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];
  public parseInt = parseInt;

  public searchPlayers() {
    if (!this.userOverlap()) {
      this.teamName.set('Select Team');
      this.teamId.set(null);
    }
    this.router.navigate(['search/players', this.searchQuery]);
  }

  private get searchQuery() {
    const model = this.searchModel();
    let query = '';
    if (model.role != null) {
      query = `role=${model.role}&`;
    }
    if (model.teamId) {
      query += `teamid=${model.teamId}&`;
    }
    return `${query}overlap=${model.scheduleOverlap}`;
  }

}
