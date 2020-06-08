import { Component } from '@angular/core';
import { getEmptyNewGroup,
  TournamentGroup,
  TournamentRegistration } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';
import { IDropDroppedEventArgs, DateRangeDescriptor, DateRangeType } from '@infragistics/igniteui-angular';
import { TournamentCSGOMatch, TournamentCSGOMatchMap } from '../../../../src-common/models/tournament-schedule';
import { CSGOActiveDutyDescriptor, ActiveDuty } from '../../../../src-common/models/csgomaps';
import { SameDay } from '../../../../src-common/models/misc';

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
  public selectedDate = new Date();
  public datesWithMatches: DateRangeDescriptor [] = [];
  public selectedMatches: TournamentCSGOMatch [] = [];

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

  public submitMatch(match: TournamentCSGOMatch) {
    if ((<TournamentCSGOMatch>match).Team1Id && (<TournamentCSGOMatch>match).Team2Id) {
      // const reg = this.registrations.find(r =>
      //   r.TeamId === (<TournamentCSGOMatch>match).Team1Id || r.TeamId === (<TournamentCSGOMatch>match).Team2Id);
      // match.GroupId = reg.TournamentCSGOGroupId;
      this.apiService.submitCSGOMatch(match).subscribe(data => {
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
      this.apiService.deleteCSGOMatch(match).subscribe(_ => {
        this.selectedMatches.splice(this.selectedMatches.indexOf(match), 1);
        this.matches.splice(this.selectedMatches.indexOf(match), 1);
      });
    } else {
      this.selectedMatches.splice(this.selectedMatches.indexOf(match), 1);
    }
  }

  public submitMatchMap(map: TournamentCSGOMatchMap) {
    this.apiService.submitCSGOMatchMap(map).subscribe(data => map.Id = data.Id);
  }

  public deleteMatchMap(map: TournamentCSGOMatchMap, maps: TournamentCSGOMatchMap []) {
    this.apiService.deleteCSGOMatchMap(map.Id).subscribe(_ => {
      maps.splice(maps.indexOf(map), 1);
    });
  }

  public daySelected(date: Date) {
    this.selectedDate = date;
    this.selectedMatches = this.matches.filter(m => SameDay(new Date(m.StartTime), this.selectedDate));
  }
}
