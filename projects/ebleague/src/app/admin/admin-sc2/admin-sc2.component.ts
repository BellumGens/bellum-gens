import { Component } from '@angular/core';
import {
  TournamentGroup,
  TournamentParticipant,
  EMPTY_NEW_GROUP,
  Tournament,
  ApiTournamentsService,
  TournamentSC2Match, TournamentMatchMap,
  SC2_MAPS, SC2LadderMap
} from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';
import { IDropDroppedEventArgs, IRowDataEventArgs, IgxGridComponent, IgxDialogComponent, IGX_SELECT_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxButtonDirective, IgxIconComponent, IgxAvatarComponent, IGX_LIST_DIRECTIVES, IGX_CARD_DIRECTIVES, IgxCircularProgressBarComponent, IGX_DRAG_DROP_DIRECTIVES, IgxBadgeComponent, IGX_DIALOG_DIRECTIVES, IGX_DATE_PICKER_DIRECTIVES, IGX_TIME_PICKER_DIRECTIVES, IgxCheckboxComponent } from '@infragistics/igniteui-angular';
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
    ConfirmComponent,
    DatePipe,
    Sc2MapNamePipe,
    NotInGroupPipe,
    GetPlayersPipe
  ]
})
export class AdminSc2Component {
  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public matches: TournamentSC2Match [];
  public loading = false;
  public loadingMatches = false;
  public loadingGroups = false;
  public environment = environment;
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP);
  public pipeTrigger = 0;
  public mapList: SC2LadderMap [] = SC2_MAPS;
  public matchInEdit: TournamentSC2Match = { startTime: new Date() };
  public tournaments: Tournament [] = [];
  public selectedTournament: Tournament;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.tournaments.subscribe(t => {
      if (t) {
        this.tournaments = t;
        this.selectedTournament = t?.find(tour => tour.active);
        this.selectTournament(this.selectedTournament);
      }
    });
  }

  public selectTournament(tournament: Tournament) {
    this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
    this.apiService.getSc2Registrations(tournament.id).subscribe(data => {
      if (data) {
        this.registrations = data;
      }
    });
    this.apiService.loadingSC2Groups.subscribe(data => this.loadingGroups = data);
    this.apiService.getSc2Groups(tournament.id).subscribe(data => this.groups = data);
    this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
    this.apiService.getSc2Matches(tournament.id).subscribe(data => {
      if (data) {
        this.matches = data;
      }
    });
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
    this.registrations.filter(r => r.tournamentSC2GroupId === id).forEach(r => r.tournamentSC2GroupId = null);
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
        this.registrations.find(r => r.id === event.dragData.id).tournamentSC2GroupId = group.id;
      },
      complete: () => this.pipeTrigger++
    });
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.id).subscribe();
    group.participants.splice(group.participants.indexOf(participant), 1);
    this.registrations.find(r => r.id === participant.id).tournamentSC2GroupId = null;
    this.pipeTrigger++;
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
    this.matchInEdit = { startTime: new Date(), tournamentId: this.selectedTournament.id, maps: [] };
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

  public sendCheckinEmails(tournamentId: string) {
    this.apiService.sendCheckinEmails(tournamentId).subscribe({
      next: () => {},
      complete: () => {}
    });
  }
}
