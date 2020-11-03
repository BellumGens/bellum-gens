import { Component, ViewChild } from '@angular/core';
import { getEmptyNewGroup,
  TournamentGroup,
  TournamentRegistration } from '../../../../src-common/models/tournament';
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
import { TournamentCSGOMatch, TournamentMatchMap } from '../../../../src-common/models/tournament-schedule';
import { CSGOActiveDutyDescriptor, ActiveDuty } from '../../../../src-common/models/csgomaps';

@Component({
  selector: 'app-admin-csgo',
  templateUrl: './admin-csgo.component.html',
  styleUrls: ['./admin-csgo.component.scss']
})
export class AdminCsgoComponent {
  public registrations: TournamentRegistration [];
  public groups: TournamentGroup [];
  public matches: TournamentCSGOMatch [];
  public loading = false;
  public loadingMatches = false;
  public environment = environment;
  public newGroup = getEmptyNewGroup();
  public pipeTrigger = 0;
  public mapList: CSGOActiveDutyDescriptor [] = ActiveDuty;
  public selectionMode = GridSelectionMode;
  public matchInEdit: TournamentCSGOMatch = { StartTime: new Date() };
  public initialFilter: FilteringExpressionsTree;

  @ViewChild('matchGrid')
  public matchGrid: IgxGridComponent;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.csgoRegistrations.subscribe(data => {
      if (data) {
        this.registrations = data;
      }
    });
    this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data);
    this.apiService.getCSGOGroups().subscribe(data => this.groups = data);
    this.apiService.loadingCSGOMatches.subscribe(data => this.loadingMatches = data);
    this.apiService.csgoMatches.subscribe(data => {
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
    this.apiService.submitCSGOGroup(group).subscribe(data => {
      if (!this.groups.find(g => g.Id === data.Id)) {
        this.groups.push(data);
      }
    });
  }

  public deleteGroup(id: string) {
    const group = this.groups.find(g => g.Id === id);
    this.apiService.deleteGroup(id).subscribe(_ => this.groups.splice(this.groups.indexOf(group), 1));
    this.registrations.filter(r => r.TournamentCSGOGroupId === id).forEach(r => r.TournamentCSGOGroupId = null);
    this.pipeTrigger++;
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.Id).subscribe();
    if (!group.Participants) {
      group.Participants = [ event.dragData ];
    } else {
      group.Participants.push(event.dragData);
    }
    event.dragData.TournamentCSGOGroupId = group.Id;
    this.pipeTrigger++;
  }

  public removeFromGroup(participant: TournamentRegistration, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.Id).subscribe();
    group.Participants.splice(group.Participants.indexOf(participant), 1);
    this.registrations.find(r => r.Id === participant.Id).TournamentCSGOGroupId = null;
    this.pipeTrigger++;
  }

  public submitMatch() {
    if (this.matchInEdit.Team1Id && this.matchInEdit.Team2Id) {
      this.apiService.submitCSGOMatch(this.matchInEdit).subscribe(data => {
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
    this.apiService.deleteCSGOMatch(match).subscribe();
  }

  public addNewMatch() {
    this.matchInEdit = { StartTime: new Date() };
  }

  public editMatch(match: TournamentCSGOMatch, dialog: IgxDialogComponent) {
    if (!(match.StartTime instanceof Date)) {
      match.StartTime = new Date(match.StartTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public submitMatchMaps() {
    this.submitMatch();
    this.matchInEdit.Maps.forEach(map => this.apiService.submitCSGOMatchMap(map).subscribe(data => map.Id = data.Id));
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    this.apiService.deleteCSGOMatchMap(map.Id).subscribe(_ => {
      maps.splice(maps.indexOf(map), 1);
    });
  }
}
