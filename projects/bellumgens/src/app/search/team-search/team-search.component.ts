import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { PlaystyleRole, TeamSearch, TEAM_SEARCH, ApplicationUser } from '../../../../../common/src/public_api';
import { Router } from '@angular/router';

import { IGX_RADIO_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/radio';
import { IGX_SLIDER_DIRECTIVES } from '@infragistics/igniteui-angular/slider';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./team-search.component.scss'],  imports: [
    FormsModule,
    IGX_RADIO_GROUP_DIRECTIVES,
    IGX_SLIDER_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective
  ]
})
export class TeamSearchComponent {
  private router = inject(Router);

  public authUser = input<ApplicationUser>();

  public role = signal<PlaystyleRole>(TEAM_SEARCH.role);
  public scheduleOverlap = signal(TEAM_SEARCH.scheduleOverlap);

  // Assembled from the individual field signals so the query builder keeps
  // working against a single object.
  public searchModel = computed<TeamSearch>(() => ({
    role: this.role(),
    scheduleOverlap: this.scheduleOverlap()
  }));

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  public parseInt = parseInt;

  public searchTeams() {
    this.router.navigate(['search/teams', this.searchQuery]);
  }

  private get searchQuery() {
    const model = this.searchModel();
    let query = '';
    if (model.role != null) {
      query = `role=${model.role}&`;
    }
    return `${query}overlap=${model.scheduleOverlap}`;
  }
}
