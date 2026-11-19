import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  EMPTY_NEW_GROUP,
  Tournament,
  TournamentGroup,
  TournamentParticipant,
  TournamentDota2Match,
  TournamentDota2MatchGame
} from 'bellum-gens-common/models';
import { ApiTournamentsService } from 'bellum-gens-common/services';
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
import { dota2DireTeamId, dota2GamesWon, dota2SortedGames, dota2TeamName } from '../../utils/dota2-series';
import { bellumgensUrl } from '../../utils/bellumgens-url';
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
  /** The team pages are on bellumgens.com, in the language the admin is browsing in. */
  public teamUrl = bellumgensUrl('/team/', inject(LOCALE_ID));
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP);
  /** A copy of the series in the open dialog, so Cancel leaves the grid row as it was. */
  public matchInEdit: TournamentDota2Match = { startTime: new Date() };
  /** Saved games removed in the Results dialog. They're deleted when the series is submitted, not before. */
  private removedGameIds: string [] = [];

  public teamName = dota2TeamName;
  public direTeamId = dota2DireTeamId;
  public sortedGames = dota2SortedGames;

  public selectTournament(tournament: Tournament) {
    this.selectedTournament.set(tournament);
  }

  // The service adds new groups to (and removes deleted ones from) its per-tournament cache
  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    const tournamentId = this.tournamentId();
    if (!group.id) {
      // A new group goes to the selected tournament, not the active league season
      group.tournamentId = tournamentId;
    }
    this.apiService.submitDota2Group(group, tournamentId).subscribe(() => {
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
    if (!match.team1Id || !match.team2Id) {
      return;
    }
    const removed = this.removedGameIds;
    this.removedGameIds = [];
    const deletes = removed.map(id => this.apiService.deleteDota2MatchGame(id));
    (deletes.length ? forkJoin(deletes) : of([])).pipe(
      switchMap(() => this.apiService.submitDota2Match(match))
    ).subscribe(data => {
      if (!data) {
        return;
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime);
      }
      if (!match.id) {
        grid.addRow(data);
      } else {
        // The server's copy carries the score and winner it worked out, and the ids of the new games
        grid.updateRow(data, match.id);
      }
    });
  }

  public deleteMatch(event: IRowDataEventArgs) {
    const match = event.data;
    this.apiService.deleteDota2Match(match).subscribe();
  }

  public addNewMatch() {
    this.removedGameIds = [];
    // Without its tournament the series wouldn't be listed with it, nor count in its standings
    this.matchInEdit = { startTime: new Date(), tournamentId: this.tournamentId() };
  }

  public editMatch(match: TournamentDota2Match, dialog: IgxDialogComponent) {
    this.removedGameIds = [];
    // The dialogs edit a copy; the row only changes once the server has saved the series.
    // The API sends the start time as an ISO string.
    this.matchInEdit = {
      ...match,
      startTime: match.startTime ? new Date(match.startTime) : new Date(),
      games: match.games?.map(game => ({ ...game }))
    };
    dialog.open();
  }

  /** Adds the next game of the series being edited; it's saved with the series. */
  public addGame() {
    const match = this.matchInEdit;
    const games = match.games ?? [];
    const gameNumber = games.reduce((last, game) => Math.max(last, game.gameNumber), 0) + 1;
    match.games = [ ...games, { dota2MatchId: match.id, gameNumber, radiantTeamId: null, winnerTeamId: null, steamMatchId: null } ];
    this.updateScore();
  }

  /** Removes a game from the series being edited; a saved game is deleted once the series is submitted. */
  public deleteGame(game: TournamentDota2MatchGame) {
    if (game.id) {
      this.removedGameIds.push(game.id);
    }
    this.matchInEdit.games = this.matchInEdit.games?.filter(g => g !== game);
    this.updateScore();
  }

  public setGameWinner(game: TournamentDota2MatchGame, winnerTeamId: string | null) {
    game.winnerTeamId = winnerTeamId;
    this.updateScore();
  }

  /**
   * With games on record, the score of a series is the games each team won (the server works it out the
   * same way), so it can't disagree with the games. Only a series without games takes a typed score.
   */
  private updateScore() {
    const match = this.matchInEdit;
    if (match.games?.length) {
      match.team1Points = dota2GamesWon(match, match.team1Id);
      match.team2Points = dota2GamesWon(match, match.team2Id);
    }
  }
}
