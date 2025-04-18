import { Component, ViewChild } from '@angular/core';
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
import {
  IDropDroppedEventArgs,
  IRowDataEventArgs,
  IgxGridComponent,
  IgxDialogComponent,
  IGX_SELECT_DIRECTIVES,
  IGX_INPUT_GROUP_DIRECTIVES,
  IGX_GRID_DIRECTIVES,
  IgxButtonDirective,
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
  IGX_ACTION_STRIP_DIRECTIVES,
  RowType,
  IGridEditEventArgs,
  IGroupingExpression,
  SortingDirection,
  DefaultSortingStrategy,
  IgxIconButtonDirective,
  IgxRippleDirective,
  IgxTextSelectionDirective,
  IGX_RADIO_GROUP_DIRECTIVES
} from '@infragistics/igniteui-angular';
import { GetPlayersPipe } from '../../pipes/get-players.pipe';
import { NotInGroupPipe } from '../../pipes/not-in-group.pipe';
import { Sc2MapNamePipe } from '../../../../../common/src/lib/pipes/sc2-map-name.pipe';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-sc2',
  templateUrl: './admin-sc2.component.html',
  styleUrls: ['./admin-sc2.component.scss'],
  imports: [
    IGX_SELECT_DIRECTIVES,
    FormsModule,
    NgClass,
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
  public registrations: TournamentApplication [];
  public participants: TournamentParticipant [];
  public groups: TournamentGroup [];
  public matches: TournamentSC2Match [];
  public loading = true;
  public loadingRegs = true;
  public loadingMatches = true;
  public loadingGroups = true;
  public environment = environment;
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP);
  public pipeTrigger = 0;
  public mapList: SC2LadderMap [] = SC2_MAPS;
  public matchInEdit: TournamentSC2Match = { startTime: new Date() };
  public tournaments: Tournament [] = [];
  public selectedTournament: Tournament;
  public grouping: IGroupingExpression [];
  public stateIcon = ['close', 'check', 'warning'];

  @ViewChild('registrationsGrid', { static: true }) public registrationsGrid: IgxGridComponent;

  constructor(private apiService: ApiTournamentsService,
              private notificationService: CommunicationService) {
    this.apiService.tournaments.subscribe(t => {
      if (t && t.length > 0) {
        this.tournaments = t;
        this.selectedTournament = t?.find(tour => tour.active);
        this.selectTournament(this.selectedTournament);
      }
    });
    this.grouping = [
      { dir: SortingDirection.Desc, fieldName: 'startTime', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
    ];
  }

  public selectTournament(tournament: Tournament) {
    this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
    this.apiService.getSc2Registrations(tournament.id).subscribe(data => {
      if (data) {
        this.participants = data;
      }
    });
    this.apiService.loadingTourRegistrations.subscribe(data => this.loadingRegs = data);
    this.apiService.tournamentRegistrations(tournament.id).subscribe(data => {
      if (data) {
        this.registrations = data;
      }
    });
    this.apiService.loadingSC2Groups.subscribe(data => this.loadingGroups = data);
    this.apiService.getSc2Groups(tournament.id).subscribe(data => this.groups = data?.reverse());
    this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
    this.apiService.getSc2Matches(tournament.id).subscribe(data => {
      if (data) {
        this.matches = data;
      }
    });
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    rowData[event.column.field] = event.newValue ? 1 : 0;
    this.apiService.confirmRegistration(rowData).subscribe({
      next: () => this.registrationsGrid.transactions.clear(rowData.id),
      complete: () => {}
    });
  }

  public deleteRegistration(rowContext: RowType) {
    rowContext.grid.transactions.commit(rowContext.grid.data, rowContext.key);
    this.apiService.deleteRegistration(rowContext.key).subscribe();
  }

  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    group.tournamentId = this.selectedTournament.id;
    this.apiService.submitSC2Group(group).subscribe(data => {
      if (!this.groups.find(g => g.id === data.id)) {
        this.groups.push(data);
      }
    });
  }

  public deleteGroup(id: string) {
    const group = this.groups.find(g => g.id === id);
    this.apiService.deleteGroup(id).subscribe(() => this.groups.splice(this.groups.indexOf(group), 1));
    this.pipeTrigger++;
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.id).subscribe({
      next: () => {
        if (!group.participants) {
          group.participants = [ event.dragData ];
        } else {
          group.participants.push(event.dragData);
        }
      },
      complete: () => this.pipeTrigger++
    });
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.id, group.id).subscribe({
      next: () => group.participants.splice(group.participants.indexOf(participant), 1)
    });
    this.pipeTrigger++;
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
    this.matchInEdit = {
      startTime: new Date(),
      tournamentId: this.selectedTournament.id,
      maps: [],
      groupId: this.groups?.length ? this.groups[this.groups.length - 1].id : null
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
      maps.splice(maps.indexOf(map), 1);
    });
  }

  public refreshMatches() {
    this.apiService.getSc2Matches(this.selectedTournament.id).subscribe(data => this.matches = data);
  }

  public refreshParticipants() {
    this.apiService.getSc2Registrations(this.selectedTournament.id).subscribe(data => this.participants = data);
  }

  public refreshRegistrations() {
    this.apiService.tournamentRegistrations(this.selectedTournament.id).subscribe(data => this.registrations = data);
    this.apiService.getSc2Groups(this.selectedTournament.id).subscribe(data => this.groups = data);
  }

  public resetCheckinState() {
    this.apiService.resetCheckinState(this.selectedTournament.id).subscribe({
      next: () => {
        this.registrations.filter(r => r.state !== TournamentApplicationState.Banned).forEach(r => r.state = 0);
        this.registrationsGrid.notifyChanges(true);
      },
      complete: () => {}
    });
  }

  public sendCheckinEmails() {
    this.notificationService.emitMessage('Sending checkin emails...');
    this.apiService.sendCheckinEmails(this.selectedTournament.id).subscribe({
      next: () => {},
      complete: () => {}
    });
  }
}
