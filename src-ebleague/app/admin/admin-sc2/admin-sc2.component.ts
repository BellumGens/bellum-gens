import { Component, ViewChild } from '@angular/core';
import { TournamentGroup,
  TournamentParticipant,
  getEmptyNewGroup} from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';
import {
  IDropDroppedEventArgs,
  GridSelectionMode,
  IRowDataEventArgs,
  IgxGridComponent,
  IgxDialogComponent,
  FilteringExpressionsTree,
  FilteringLogic,
  IgxDateFilteringOperand
} from '@infragistics/igniteui-angular';
import { TournamentSC2Match, TournamentMatchMap } from '../../../../src-common/models/tournament-schedule';
import { SC2_MAPS, SC2LadderDescriptor } from '../../../../src-common/models/sc2maps';

@Component({
  selector: 'app-admin-sc2',
  templateUrl: './admin-sc2.component.html',
  styleUrls: ['./admin-sc2.component.scss']
})
export class AdminSc2Component {
  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public matches: TournamentSC2Match [];
  public loading = false;
  public loadingMatches = false;
  public environment = environment;
  public newGroup = getEmptyNewGroup();
  public pipeTrigger = 0;
  public mapList: SC2LadderDescriptor [] = SC2_MAPS;
  public selectionMode = GridSelectionMode;
  public matchInEdit: TournamentSC2Match = { startTime: new Date() };
  public initialFilter: FilteringExpressionsTree;

  @ViewChild('matchGrid')
  public matchGrid: IgxGridComponent;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.sc2Registrations.subscribe(data => {
      if (data) {
        this.registrations = data;
      }
    });
    this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
    this.apiService.getSC2Groups().subscribe(data => this.groups = data);
    this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
    this.apiService.sc2Matches.subscribe(data => {
      if (data) {
        data.forEach(item => item.startTime = new Date(item.startTime));
        this.matches = data;
      }
    });

    const gridFilteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And);
    const productFilteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And, 'StartTime');
    const productExpression = {
        condition: IgxDateFilteringOperand.instance().condition('after'),
        fieldName: 'StartTime',
        searchVal: new Date(2020, 10, 6)
    };
    productFilteringExpressionsTree.filteringOperands.push(productExpression);
    gridFilteringExpressionsTree.filteringOperands.push(productFilteringExpressionsTree);
    this.initialFilter = gridFilteringExpressionsTree;
  }

  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    this.apiService.submitSC2Group(group).subscribe(data => {
      if (!this.groups.find(g => g.id === data.id)) {
        this.groups.push(data);
      }
    });
  }

  public deleteGroup(id: string) {
    const group = this.groups.find(g => g.id === id);
    this.apiService.deleteGroup(id).subscribe(_ => this.groups.splice(this.groups.indexOf(group), 1));
    this.registrations.filter(r => r.tournamentSC2GroupId === id).forEach(r => r.tournamentSC2GroupId = null);
    this.pipeTrigger++;
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.id).subscribe();
    if (!group.participants) {
      group.participants = [ event.dragData ];
    } else {
      group.participants.push(event.dragData);
    }
    event.dragData.TournamentSC2GroupId = group.id;
    this.pipeTrigger++;
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.id).subscribe();
    group.participants.splice(group.participants.indexOf(participant), 1);
    this.registrations.find(r => r.id === participant.id).tournamentSC2GroupId = null;
    this.pipeTrigger++;
  }

  public submitMatch() {
    if (this.matchInEdit.player1Id && this.matchInEdit.player2Id) {
      this.apiService.submitSC2Match(this.matchInEdit).subscribe(data => {
        if (data) {
          if (!this.matchInEdit.id) {
            data.startTime = new Date(data.startTime);
            this.matchGrid.addRow(data);
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
    this.matchInEdit = { startTime: new Date() };
  }

  public editMatch(match: TournamentSC2Match, dialog: IgxDialogComponent) {
    if (!(match.startTime instanceof Date)) {
      match.startTime = new Date(match.startTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public submitMatchMaps() {
    this.submitMatch();
    this.matchInEdit.maps.forEach(map => this.apiService.submitSC2MatchMap(map).subscribe(data => map.id = data.id));
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    this.apiService.deleteSC2MatchMap(map.id).subscribe(_ => {
      maps.splice(maps.indexOf(map), 1);
    });
  }
}
