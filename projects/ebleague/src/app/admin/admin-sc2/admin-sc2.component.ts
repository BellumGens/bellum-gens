import { ChangeDetectorRef, Component, computed, effect, inject, linkedSignal, signal, untracked, viewChild } from '@angular/core';
import {
  TournamentGroup,
  TournamentParticipant,
  EMPTY_NEW_GROUP,
  Tournament,
  ApiTournamentsService,
  TournamentSC2Match, TournamentMatchMap,
  SC2_MAPS, SC2LadderMap,
  CommunicationService,
  TournamentApplication,
  TournamentApplicationState
} from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';
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
import { Sc2MapNamePipe } from '../../../../../common/src/lib/pipes/sc2-map-name.pipe';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
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
  public selectedTournament = signal<Tournament>(null);
  private tournamentId = computed(() => this.selectedTournament()?.id);
  // Local copies of the selected tournament's cached data, reset whenever the cache changes
  public registrations = linkedSignal<TournamentApplication []>(() =>
    this.tournamentId() ? this.apiService.tournamentRegistrations(this.tournamentId())() : null);
  public participants = computed<TournamentParticipant []>(() =>
    this.tournamentId() ? this.apiService.getSc2Registrations(this.tournamentId())() : null);
  // The service caches the groups in reverse server order; the admin view lists them in server order
  public groups = linkedSignal<TournamentGroup []>(() => {
    const groups = this.tournamentId() ? this.apiService.getSc2Groups(this.tournamentId())() : null;
    return groups ? [...groups].reverse() : groups;
  });
  public matches = linkedSignal<TournamentSC2Match []>(() =>
    this.tournamentId() ? this.apiService.getSc2Matches(this.tournamentId())() : null);
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
    this.apiService.refreshSc2Registrations(tournament.id);
    this.apiService.refreshTournamentRegistrations(tournament.id);
    this.apiService.refreshSc2Groups(tournament.id);
    this.apiService.refreshSc2Matches(tournament.id);
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    rowData[event.column.field] = event.newValue ? 1 : 0;
    this.apiService.confirmRegistration(rowData).subscribe({
      next: () => this.registrationsGrid().transactions.clear(rowData.id),
      complete: () => {}
    });
  }

  public deleteRegistration(rowContext: RowType) {
    rowContext.grid.transactions.commit(rowContext.grid.data, rowContext.key);
    this.apiService.deleteRegistration(rowContext.key).subscribe();
  }

  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    group.tournamentId = this.selectedTournament().id;
    this.apiService.submitSC2Group(group).subscribe(data => {
      if (!this.groups().find(g => g.id === data.id)) {
        this.groups.update(groups => [...groups, data]);
      }
    });
  }

  public deleteGroup(id: string) {
    this.apiService.deleteGroup(id).subscribe(() => this.groups.update(groups => groups.filter(g => g.id !== id)));
    this.pipeTrigger.update(trigger => trigger + 1);
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.id).subscribe({
      next: () => group.participants = [ ...(group.participants || []), event.dragData ],
      complete: () => this.pipeTrigger.update(trigger => trigger + 1)
    });
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.id, group.id).subscribe({
      next: () => {
        group.participants = group.participants.filter(p => p !== participant);
        this.pipeTrigger.update(trigger => trigger + 1);
      }
    });
  }

  public submitParticipantPoints(participantId: string, groupId: string, points: number) {
    this.apiService.submitParticipantPoints(participantId, groupId, points).subscribe();
  }

  public submitMatch(grid: IgxGridComponent) {
    if (this.matchInEdit.player1Id && this.matchInEdit.player2Id) {
      this.apiService.submitSC2Match(this.matchInEdit).subscribe(data => {
        if (data) {
          if (!this.matchInEdit.id) {
            data.startTime = new Date(data.startTime);
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
      tournamentId: this.selectedTournament().id,
      maps: [],
      groupId: groups?.length ? groups[groups.length - 1].id : null
    };
  }

  public editMatch(match: TournamentSC2Match, dialog: IgxDialogComponent) {
    if (!(match.startTime instanceof Date)) {
      match.startTime = new Date(match.startTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    this.apiService.deleteSC2MatchMap(map.id).subscribe(() => {
      // The maps array belongs to the grid row being edited, so it's updated in place
      maps.splice(maps.indexOf(map), 1);
      this.cdr.markForCheck();
    });
  }

  public refreshMatches() {
    this.apiService.refreshSc2Matches(this.tournamentId());
  }

  public refreshParticipants() {
    this.apiService.refreshSc2Registrations(this.tournamentId());
  }

  public refreshRegistrations() {
    this.apiService.refreshTournamentRegistrations(this.tournamentId());
    this.apiService.refreshSc2Groups(this.tournamentId());
  }

  public resetCheckinState() {
    this.apiService.resetCheckinState(this.selectedTournament().id).subscribe({
      next: () => {
        // Row objects are shared with the grid's batch editing, so they're reset in place
        this.registrations().filter(r => r.state !== TournamentApplicationState.Banned).forEach(r => r.state = 0);
        this.registrationsGrid().notifyChanges(true);
      },
      complete: () => {}
    });
  }

  public sendCheckinEmails() {
    this.notificationService.emitMessage('Sending checkin emails...');
    this.apiService.sendCheckinEmails(this.selectedTournament().id).subscribe({
      next: () => {},
      complete: () => {}
    });
  }
}
