import { Component } from '@angular/core';
import { TournamentGroup,
  TournamentRegistration,
  getEmptyNewGroup} from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';
import { IDropDroppedEventArgs, DateRangeDescriptor, DateRangeType } from '@infragistics/igniteui-angular';
import { TournamentSC2Match, TournamentSC2MatchMap } from '../../../../src-common/models/tournament-schedule';
import { SC2_MAPS, SC2LadderDescriptor } from '../../../../src-common/models/sc2maps';
import { SameDay } from '../../../../src-common/models/misc';

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
  public selectedDate = new Date();
  public datesWithMatches: DateRangeDescriptor [] = [];
  public selectedMatches: TournamentSC2Match [] = [];

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
        this.matches = data;
        this.matches.forEach(m => m.StartTime = new Date(m.StartTime));
        this.selectedMatches = this.matches.filter(m => SameDay(m.StartTime, this.selectedDate));
        this.matches.forEach(match => {
          this.datesWithMatches.push({ type: DateRangeType.Specific, dateRange: [ match.StartTime ] });
        });
      }
    });
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

  public submitMatch(match: TournamentSC2Match) {
    if ((<TournamentSC2Match>match).Player1Id && (<TournamentSC2Match>match).Player2Id) {
      // const reg = this.registrations.find(r =>
      //   r.UserId === (<TournamentSC2Match>match).Player1Id || r.UserId === (<TournamentSC2Match>match).Player2Id);
      // match.GroupId = reg.TournamentSC2GroupId;
      this.apiService.submitSC2Match(match).subscribe(data => {
        if (!match.Id) {
          this.matches.push(data);
          match.Id = data.Id;
        }
        if (!match.Maps) {
          match.Maps = [];
        }
        match.inEdit = false;
      });
    }
  }

  public deleteMatch(match) {
    if (match.Id) {
      this.apiService.deleteSC2Match(match).subscribe(_ => {
        this.selectedMatches.splice(this.selectedMatches.indexOf(match), 1);
        this.matches.splice(this.selectedMatches.indexOf(match), 1);
      });
    } else {
      this.selectedMatches.splice(this.selectedMatches.indexOf(match), 1);
    }
  }

  public submitMatchMap(map: TournamentSC2MatchMap) {
    this.apiService.submitSC2MatchMap(map).subscribe(data => map.Id = data.Id);
  }

  public deleteMatchMap(map: TournamentSC2MatchMap, maps: TournamentSC2MatchMap []) {
    this.apiService.deleteSC2MatchMap(map.Id).subscribe(_ => {
      maps.splice(maps.indexOf(map), 1);
    });
  }

  public daySelected(date: Date) {
    this.selectedDate = date;
    this.selectedMatches = this.matches.filter(m => SameDay(new Date(m.StartTime), this.selectedDate));
  }
}
