import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import {
  EMPTY_NEW_GROUP,
  Tournament,
  TournamentGroup,
  TournamentParticipant,
  TournamentDota2Match,
  TournamentDota2MatchGame
} from 'bellum-gens-common/models';
import { ApiTournamentsService } from 'bellum-gens-common/services';
import { environment } from 'bellum-gens-common/environments';
import { ConfirmComponent } from 'bellum-gens-common';
import { IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES, IgxButtonDirective, IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IRowDataEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { IGX_GRID_DIRECTIVES, IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IGX_DIALOG_DIRECTIVES, IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IGX_DATE_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/date-picker';
import { IGX_TIME_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/time-picker';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { dota2DireTeamId, dota2SortedGames, dota2TeamName } from '../../utils/dota2-series';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dota2',
  templateUrl: './admin-dota2.component.html',
  styleUrls: ['./admin-dota2.component.scss'],
  imports: [
    IGX_SELECT_DIRECTIVES,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_GRID_DIRECTIVES,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxIconComponent,
    IgxAvatarComponent,
    IGX_LIST_DIRECTIVES,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxBadgeComponent,
    IGX_DIALOG_DIRECTIVES,
    IGX_DATE_PICKER_DIRECTIVES,
    IGX_TIME_PICKER_DIRECTIVES,
    IgxCheckboxComponent,
    ConfirmComponent,
    DatePipe
  ]
})
export class AdminDota2Component {
  private apiService = inject(ApiTournamentsService);
  private cdr = inject(ChangeDetectorRef);

  public tournaments = this.apiService.tournaments;
  public selectedTournament = signal<Tournament | null>(null);
  private tournamentId = computed(() => this.selectedTournament()?.id);
  public registrations = computed<TournamentParticipant [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getDota2Registrations(id)() : null;
  });
  public groups = computed<TournamentGroup [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getDota2Groups(id)() : null;
  });
  public matches = computed<TournamentDota2Match [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getDota2Matches(id)() : null;
  });
  /** Bumped whenever the group lists change in place, so the unassigned teams are worked out again. */
  public groupsTrigger = signal(0);
  /**
   * The registered teams that aren't in a group yet. The Dota 2 registrations don't carry their group,
   * so they're matched against the participants listed by the groups.
   */
  public unassigned = computed<TournamentParticipant [] | null>(() => {
    this.groupsTrigger();
    const grouped = new Set((this.groups() ?? []).flatMap(group => (group.participants ?? []).map(p => p.id)));
    return this.registrations()?.filter(r => !grouped.has(r.id)) ?? null;
  });
  public loading = this.apiService.loadingDota2Registrations;
  public loadingMatches = this.apiService.loadingDota2Matches;
  public environment = environment;
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP);
  public matchInEdit: TournamentDota2Match = { startTime: new Date() };

  public teamName = dota2TeamName;
  public direTeamId = dota2DireTeamId;
  public sortedGames = dota2SortedGames;

  public selectTournament(tournament: Tournament) {
    this.selectedTournament.set(tournament);
  }

  // The service adds new groups to (and removes deleted ones from) its per-tournament cache
  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    this.apiService.submitDota2Group(group, this.tournamentId()).subscribe(() => {
      if (group === this.newGroup) {
        // The New group card starts over once its group is created
        this.newGroup = Object.assign({}, EMPTY_NEW_GROUP);
      }
    });
  }

  // The members of the deleted group are unassigned again once the service cache drops the group
  public deleteGroup(id: string) {
    this.apiService.deleteGroup(id).subscribe();
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    const groupId = group.id;
    if (!groupId) {
      return;
    }
    this.apiService.addParticipantToGroup(event.dragData, groupId).subscribe();
    group.participants = [ ...(group.participants || []), event.dragData ];
    this.groupsTrigger.update(trigger => trigger + 1);
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    if (!group.id) {
      return;
    }
    this.apiService.removeParticipantFromGroup(participant.id, group.id).subscribe({
      next: () => {
        group.participants = group.participants?.filter(p => p !== participant);
        this.groupsTrigger.update(trigger => trigger + 1);
      }
    });
  }

  public submitMatch(grid: IgxGridComponent) {
    const match = this.matchInEdit;
    if (match.team1Id && match.team2Id) {
      this.apiService.submitDota2Match(match).subscribe(data => {
        if (data) {
          if (data.startTime) {
            data.startTime = new Date(data.startTime);
          }
          if (!match.id) {
            grid.addRow(data);
          } else {
            // The server works out the winner and assigns ids to the newly added games
            grid.updateRow({ winnerTeamId: data.winnerTeamId, games: data.games ?? match.games }, match.id);
          }
        }
      });
    }
  }

  public deleteMatch(event: IRowDataEventArgs) {
    const match = event.data;
    this.apiService.deleteDota2Match(match).subscribe();
  }

  public addNewMatch() {
    this.matchInEdit = { startTime: new Date() };
  }

  public editMatch(match: TournamentDota2Match, dialog: IgxDialogComponent) {
    // The API sends the start time as an ISO string
    const startTime: Date | string | undefined = match.startTime;
    if (startTime && !(startTime instanceof Date)) {
      match.startTime = new Date(startTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  /** Adds the next game of the series being edited; it's saved with the series. */
  public addGame() {
    const match = this.matchInEdit;
    const games = match.games ?? [];
    const gameNumber = games.reduce((last, game) => Math.max(last, game.gameNumber), 0) + 1;
    match.games = [ ...games, { dota2MatchId: match.id, gameNumber, radiantTeamId: null, winnerTeamId: null, steamMatchId: null } ];
  }

  public deleteGame(game: TournamentDota2MatchGame) {
    const match = this.matchInEdit;
    const remove = () => {
      // The games belong to the grid row being edited, so the row keeps the remaining ones
      match.games = match.games?.filter(g => g !== game);
      this.cdr.markForCheck();
    };
    if (!game.id) {
      // A game that hasn't been saved yet only exists in the dialog
      remove();
      return;
    }
    this.apiService.deleteDota2MatchGame(game.id).subscribe(() => remove());
  }
}
