import { ChangeDetectorRef, Component, computed, effect, inject, linkedSignal, signal, untracked, viewChild } from '@angular/core';
import {
  TournamentGroup,
  TournamentParticipant,
  EMPTY_NEW_GROUP,
  Tournament,
  TournamentSC2Match,
  TournamentMatchMap,
  SC2_MAPS,
  SC2LadderMap,
  TournamentApplication,
  TournamentApplicationState
} from 'bellum-gens-common/models';
import { ApiTournamentsService, CommunicationService } from 'bellum-gens-common/services';
import { environment } from 'bellum-gens-common/environments';
import { Sc2MapNamePipe } from 'bellum-gens-common/pipes';
import { ConfirmComponent } from 'bellum-gens-common';
import { IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES, IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective, IgxTextSelectionDirective } from '@infragistics/igniteui-angular/directives';
import { IGridEditEventArgs, IRowDataEventArgs, RowType } from '@infragistics/igniteui-angular/grids/core';
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
import { IGX_ACTION_STRIP_DIRECTIVES } from '@infragistics/igniteui-angular/action-strip';
import { DefaultSortingStrategy, IGroupingExpression, SortingDirection } from '@infragistics/igniteui-angular/core';
import { IGX_RADIO_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/radio';
import { GetPlayersPipe } from '../../pipes/get-players.pipe';
import { NotInGroupPipe } from '../../pipes/not-in-group.pipe';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-sc2',
  templateUrl: './admin-sc2.component.html',
  styleUrls: ['./admin-sc2.component.scss'],
  imports: [
    IGX_SELECT_DIRECTIVES,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_GRID_DIRECTIVES,
    IGX_ACTION_STRIP_DIRECTIVES,
    IgxIconButtonDirective,
    IgxButtonDirective,
    IgxRippleDirective,
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
    IGX_RADIO_GROUP_DIRECTIVES,
    IgxCheckboxComponent,
    IgxTextSelectionDirective,
    ConfirmComponent,
    DatePipe,
    Sc2MapNamePipe,
    NotInGroupPipe,
    GetPlayersPipe
  ]
})
export class AdminSc2Component {
  private apiService = inject(ApiTournamentsService);
  private notificationService = inject(CommunicationService);
  private cdr = inject(ChangeDetectorRef);

  private allTournaments = this.apiService.tournaments;
  public tournaments = computed(() => this.allTournaments() ?? []);
  public selectedTournament = signal<Tournament | null>(null);
  private tournamentId = computed(() => this.selectedTournament()?.id);
  // Local copies of the selected tournament's cached data, reset whenever the cache changes
  public registrations = linkedSignal<TournamentApplication [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.tournamentRegistrations(id)() : null;
  });
  public participants = computed<TournamentParticipant [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getSc2Registrations(id)() : null;
  });
  // The service caches the groups in reverse server order; the admin view lists them in server order
  public groups = linkedSignal<TournamentGroup [] | null>(() => {
    const id = this.tournamentId();
    const groups = id ? this.apiService.getSc2Groups(id)() : null;
    return groups ? [...groups].reverse() : groups;
  });
  public matches = linkedSignal<TournamentSC2Match [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getSc2Matches(id)() : null;
  });
  public loading = this.apiService.loadingSC2Registrations;
  public loadingRegs = this.apiService.loadingTourRegistrations;
  public loadingMatches = this.apiService.loadingSC2Matches;
  public loadingGroups = this.apiService.loadingSC2Groups;
  public environment = environment;
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP);
  public pipeTrigger = signal(0);
  public mapList: SC2LadderMap [] = SC2_MAPS;
  public matchInEdit: TournamentSC2Match = { startTime: new Date() };
  public grouping: IGroupingExpression [] = [
    { dir: SortingDirection.Desc, fieldName: 'startTime', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
  ];
  public stateIcon = ['close', 'check', 'warning'];

  public registrationsGrid = viewChild.required<IgxGridComponent>('registrationsGrid');

  constructor() {
    // Select the active tournament once the tournaments are loaded
    effect(() => {
      const active = this.tournaments().find(tour => tour.active);
      if (active) {
        untracked(() => {
          this.selectedTournament.set(active);
          this.selectTournament(active);
        });
      }
    });
  }

  // Selecting a tournament always loads its latest data
  public selectTournament(tournament: Tournament) {
    const id = tournament.id;
    if (!id) {
      return;
    }
    this.apiService.refreshSc2Registrations(id);
    this.apiService.refreshTournamentRegistrations(id);
    this.apiService.refreshSc2Groups(id);
    this.apiService.refreshSc2Matches(id);
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    const field = event.column?.field;
    if (!field) {
      return;
    }
    rowData[field] = event.newValue ? 1 : 0;
    this.apiService.confirmRegistration(rowData).subscribe({
      next: () => this.registrationsGrid().transactions.clear(rowData.id),
      complete: () => {}
    });
  }

  // Applies the row's pending changes and deletes it on the server only if it was marked deleted
  public saveRegistration(rowContext: RowType) {
    const deleted = rowContext.deleted;
    rowContext.grid.transactions.commit(rowContext.grid.data ?? [], rowContext.key);
    if (deleted) {
      this.apiService.deleteRegistration(rowContext.key).subscribe();
    }
  }

  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    group.tournamentId = this.tournamentId();
    this.apiService.submitSC2Group(group).subscribe(data => {
      if (!this.groups()?.find(g => g.id === data.id)) {
        this.groups.update(groups => [...(groups ?? []), data]);
      }
      if (group === this.newGroup) {
        // The New group card starts over once its group is created
        this.newGroup = Object.assign({}, EMPTY_NEW_GROUP);
      }
    });
  }

  public deleteGroup(id: string) {
    this.apiService.deleteGroup(id).subscribe(() => {
      this.groups.update(groups => groups?.filter(g => g.id !== id) ?? null);
      // The members of the deleted group are unassigned again
      this.participants()?.filter(p => p.tournamentSC2GroupId === id).forEach(p => p.tournamentSC2GroupId = null);
      this.pipeTrigger.update(trigger => trigger + 1);
    });
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    const groupId = group.id;
    if (!groupId) {
      return;
    }
    this.apiService.addParticipantToGroup(event.dragData, groupId).subscribe({
      next: () => {
        group.participants = [ ...(group.participants || []), event.dragData ];
        event.dragData.tournamentSC2GroupId = groupId;
      },
      complete: () => this.pipeTrigger.update(trigger => trigger + 1)
    });
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    if (!group.id) {
      return;
    }
    this.apiService.removeParticipantFromGroup(participant.id, group.id).subscribe({
      next: () => {
        group.participants = group.participants?.filter(p => p !== participant);
        participant.tournamentSC2GroupId = null;
        // The groups list their own copies of the participants, so the unassigned participant is cleared as well
        const listed = this.participants()?.find(p => p.id === participant.id);
        if (listed) {
          listed.tournamentSC2GroupId = null;
        }
        this.pipeTrigger.update(trigger => trigger + 1);
      }
    });
  }

  public submitParticipantPoints(participantId: string, groupId: string | null | undefined, points: number) {
    if (!groupId) {
      return;
    }
    this.apiService.submitParticipantPoints(participantId, groupId, points).subscribe();
  }

  public submitMatch(grid: IgxGridComponent) {
    if (this.matchInEdit.player1Id && this.matchInEdit.player2Id) {
      this.apiService.submitSC2Match(this.matchInEdit).subscribe(data => {
        if (data) {
          if (!this.matchInEdit.id) {
            if (data.startTime) {
              data.startTime = new Date(data.startTime);
            }
            grid.addRow(data);
          }
        }
      });
    }
  }

  public deleteMatch(event: IRowDataEventArgs) {
    const match = event.data;
    this.apiService.deleteSC2Match(match).subscribe();
  }

  public addNewMatch() {
    const groups = this.groups();
    this.matchInEdit = {
      startTime: new Date(),
      tournamentId: this.tournamentId(),
      maps: [],
      groupId: groups?.length ? groups[groups.length - 1].id : undefined
    };
  }

  public editMatch(match: TournamentSC2Match, dialog: IgxDialogComponent) {
    // The API sends the start time as an ISO string
    const startTime: Date | string | undefined = match.startTime;
    if (startTime && !(startTime instanceof Date)) {
      match.startTime = new Date(startTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    if (!map.id) {
      return;
    }
    this.apiService.deleteSC2MatchMap(map.id).subscribe(() => {
      // The maps array belongs to the grid row being edited, so it's updated in place
      maps.splice(maps.indexOf(map), 1);
      this.cdr.markForCheck();
    });
  }

  public refreshMatches() {
    const id = this.tournamentId();
    if (id) {
      this.apiService.refreshSc2Matches(id);
    }
  }

  public refreshParticipants() {
    const id = this.tournamentId();
    if (id) {
      this.apiService.refreshSc2Registrations(id);
    }
  }

  public refreshRegistrations() {
    const id = this.tournamentId();
    if (id) {
      this.apiService.refreshTournamentRegistrations(id);
      this.apiService.refreshSc2Groups(id);
    }
  }

  public resetCheckinState() {
    const id = this.tournamentId();
    if (!id) {
      return;
    }
    this.apiService.resetCheckinState(id).subscribe({
      next: () => {
        // Row objects are shared with the grid's batch editing, so they're reset in place
        this.registrations()?.filter(r => r.state !== TournamentApplicationState.Banned).forEach(r => r.state = 0);
        this.registrationsGrid().notifyChanges(true);
      },
      complete: () => {}
    });
  }

  public sendCheckinEmails() {
    const id = this.tournamentId();
    if (!id) {
      return;
    }
    this.notificationService.emitMessage('Sending checkin emails...');
    this.apiService.sendCheckinEmails(id).subscribe({
      next: () => {},
      complete: () => {}
    });
  }
}
