import { Component } from '@angular/core';
import { getEmptyNewGroup,
  TournamentGroup,
  TournamentRegistration } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';
import { IDropDroppedEventArgs } from 'igniteui-angular';
import { TournamentCSGOMatch, MatchScheduleSlot, TournamentCSGOMatchMap } from '../../../../src-common/models/tournament-schedule';
import { WEEKLY_SCHEDULE } from '../../../../src-common/models/schedule-slots';
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
  public environment = environment;
  public newGroup = getEmptyNewGroup();
  public pipeTrigger = 0;
  public schedule = WEEKLY_SCHEDULE;
  public mapList: CSGOActiveDutyDescriptor [] = ActiveDuty;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.csgoRegistrations.subscribe(data => {
      if (data) {
        this.registrations = data;
      }
    });
    this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data);
    this.apiService.getCSGOGroups().subscribe(data => this.groups = data);
    this.apiService.csgoMatches.subscribe(data => {
      this.matches = data;
      if (this.matches) {
        this.schedule.forEach(week => {
          week.days.forEach(day => {
            day.slots.forEach(s => {
              const match = this.matches.find(m => new Date(m.StartTime).getTime() === s.start.getTime());
              if (match) {
                s.match = match;
              }
            });
          });
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

  public submitMatch(slot: MatchScheduleSlot) {
    const match = slot.match;
    if ((<TournamentCSGOMatch>match).Team1Id && (<TournamentCSGOMatch>match).Team2Id) {
      const reg = this.registrations.find(r =>
        r.TeamId === (<TournamentCSGOMatch>match).Team1Id || r.TeamId === (<TournamentCSGOMatch>match).Team2Id);
      match.GroupId = reg.TournamentCSGOGroupId;
      this.apiService.submitCSGOMatch(match).subscribe(data => slot.match = data);
      slot.inEdit = false;
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
}
