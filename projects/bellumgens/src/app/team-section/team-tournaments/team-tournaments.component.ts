import { Component, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import {
  BellumgensApiService,
  CSGOTeam
} from '../../../../../common/src/public_api';
import { ROUTER_OUTLET_DATA } from '@angular/router';
// import { IgxGridModule, IgxAvatarModule, IgxListModule } from '@infragistics/igniteui-angular';


@Component({
    selector: 'app-team-tournaments',
    templateUrl: './team-tournaments.component.html',
    styleUrls: ['./team-tournaments.component.scss'],
    imports: []
})
export class TeamTournamentsComponent {
  private apiService = inject(BellumgensApiService);

  // Handed down by the parent TeamComponent through the router outlet.
  public team = inject(ROUTER_OUTLET_DATA) as Signal<CSGOTeam>;

  public tournaments = toSignal(toObservable(this.team).pipe(
    map(team => team?.teamId),
    filter(teamId => !!teamId),
    distinctUntilChanged(),
    switchMap(teamId => this.apiService.getTeamTournaments(teamId))
  ));
  public emptyGuid = '00000000-0000-0000-0000-000000000000';
}
