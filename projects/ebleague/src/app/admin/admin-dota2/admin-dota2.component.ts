import { Component, computed, effect, inject, LOCALE_ID, signal, untracked } from '@angular/core';
import { concat } from 'rxjs';
import { switchMap, tap, toArray } from 'rxjs/operators';
import {
  EMPTY_NEW_GROUP,
  Game,
  Tournament,
  TournamentParticipant,
  TournamentDota2Match,
  TournamentDota2MatchGame,
  TournamentDota2Group
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

  private allTournaments = this.apiService.tournaments;
  /** Only Dota 2 tournaments have Dota 2 groups and series to manage. */
  public tournaments = computed(() => (this.allTournaments() ?? []).filter(tournament => tournament.game === Game.Dota2));
  public selectedTournament = signal<Tournament | null>(null);
  private tournamentId = computed(() => this.selectedTournament()?.id);
  public registrations = computed<TournamentParticipant [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getDota2Registrations(id)() : null;
  });
  public groups = computed<TournamentDota2Group [] | null>(() => {
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
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP) as TournamentDota2Group;
  /** A copy of the series in the open dialog, so Cancel leaves the grid row as it was. */
  public matchInEdit: TournamentDota2Match = { startTime: new Date() };
  /** Saved games removed in the Results dialog. They're deleted when the series is submitted, not before. */
  private removedGameIds: string [] = [];
  /** A series is being saved; Submit does nothing until it's done. */
  private savingMatch = signal(false);

  public teamName = dota2TeamName;
  public direTeamId = dota2DireTeamId;
  public sortedGames = dota2SortedGames;

  constructor() {
    // Open the active Dota 2 tournament (or the first one) once the tournaments are loaded
    effect(() => {
      const tournaments = this.tournaments();
      if (!untracked(this.selectedTournament)) {
        const tournament = tournaments.find(t => t.active) ?? tournaments[0];
        if (tournament) {
          untracked(() => this.selectTournament(tournament));
        }
      }
    });
  }

  public selectTournament(tournament: Tournament) {
    this.selectedTournament.set(tournament);
  }

  // The service adds new groups to (and removes deleted ones from) its per-tournament cache
  public submitGroup(group: TournamentDota2Group) {
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

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentDota2Group) {
    const groupId = group.id;
    if (!groupId) {
      return;
    }
    this.apiService.addParticipantToGroup(event.dragData, groupId).subscribe();
    group.participants = [ ...(group.participants || []), event.dragData ];
    this.groupsTrigger.update(trigger => trigger + 1);
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentDota2Group) {
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

  /**
   * Deletes the games removed from the series, then saves it. The dialog closes only once the series is saved,
   * so nothing the admin entered is lost when a request fails; Submit then retries what is left to do.
   */
  public submitMatch(grid: IgxGridComponent, dialog: IgxDialogComponent) {
    const match = this.matchInEdit;
    if (!match.team1Id || !match.team2Id || this.savingMatch()) {
      // The required team selects show what is missing
      return;
    }
    this.savingMatch.set(true);
    let gameDeleted = false;
    // One at a time, each forgotten once it's deleted, so a retry deletes only the games still on the server
    const deletes = this.removedGameIds.map(id => this.apiService.deleteDota2MatchGame(id).pipe(
      tap(() => {
        gameDeleted = true;
        this.removedGameIds = this.removedGameIds.filter(removed => removed !== id);
      })
    ));
    concat(...deletes).pipe(
      toArray(),
      switchMap(() => this.apiService.submitDota2Match(match))
    ).subscribe({
      next: data => {
        this.savingMatch.set(false);
        dialog.close();
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
      },
      // The service reports the error
      error: () => {
        this.savingMatch.set(false);
        const tournamentId = this.tournamentId();
        if (gameDeleted && tournamentId) {
          // The games deleted before the failure are gone on the server, so the grid shows the series as saved there
          this.apiService.refreshDota2Matches(tournamentId);
        }
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
