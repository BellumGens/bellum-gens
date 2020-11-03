import { Component, ViewChild } from '@angular/core';
import { TournamentGroup,
  TournamentRegistration,
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
  public registrations: TournamentRegistration [];
  public groups: TournamentGroup [];
  public matches: TournamentSC2Match [];
  public loading = false;
  public loadingMatches = false;
  public environment = environment;
  public newGroup = getEmptyNewGroup();
  public pipeTrigger = 0;
  public mapList: SC2LadderDescriptor [] = SC2_MAPS;
  public selectionMode = GridSelectionMode;
  public matchInEdit: TournamentSC2Match = { StartTime: new Date() };
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
        data.forEach(item => item.StartTime = new Date(item.StartTime));
        this.matches = data;
      }
    });

    const gridFilteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And);
    const productFilteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And, 'StartTime');
    const productExpression = {
        condition: IgxDateFilteringOperand.instance().condition('after'),
        fieldName: 'StartTime',
        searchVal: new Date(2020, 8, 27)
    };
    productFilteringExpressionsTree.filteringOperands.push(productExpression);
    gridFilteringExpressionsTree.filteringOperands.push(productFilteringExpressionsTree);
    this.initialFilter = gridFilteringExpressionsTree;
  }

  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    this.apiService.submitSC2Group(group).subscribe(data => {
      if (!this.groups.find(g => g.Id === data.Id)) {
        this.groups.push(data);
      }
    });
  }

  public deleteGroup(id: string) {
    const group = this.groups.find(g => g.Id === id);
    this.apiService.deleteGroup(id).subscribe(_ => this.groups.splice(this.groups.indexOf(group), 1));
    this.registrations.filter(r => r.TournamentSC2GroupId === id).forEach(r => r.TournamentSC2GroupId = null);
    this.pipeTrigger++;
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.Id).subscribe();
    if (!group.Participants) {
      group.Participants = [ event.dragData ];
    } else {
      group.Participants.push(event.dragData);
    }
    event.dragData.TournamentSC2GroupId = group.Id;
    this.pipeTrigger++;
  }

  public removeFromGroup(participant: TournamentRegistration, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.Id).subscribe();
    group.Participants.splice(group.Participants.indexOf(participant), 1);
    this.registrations.find(r => r.Id === participant.Id).TournamentSC2GroupId = null;
    this.pipeTrigger++;
  }

  public submitMatch() {
    if (this.matchInEdit.Player1Id && this.matchInEdit.Player2Id) {
      this.apiService.submitSC2Match(this.matchInEdit).subscribe(data => {
        if (data) {
          if (!this.matchInEdit.Id) {
            data.StartTime = new Date(data.StartTime);
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
    this.matchInEdit = { StartTime: new Date() };
  }

  public editMatch(match: TournamentSC2Match, dialog: IgxDialogComponent) {
    if (!(match.StartTime instanceof Date)) {
      match.StartTime = new Date(match.StartTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public submitMatchMaps() {
    this.submitMatch();
    this.matchInEdit.Maps.forEach(map => this.apiService.submitSC2MatchMap(map).subscribe(data => map.Id = data.Id));
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    this.apiService.deleteSC2MatchMap(map.Id).subscribe(_ => {
      maps.splice(maps.indexOf(map), 1);
    });
  }
}
