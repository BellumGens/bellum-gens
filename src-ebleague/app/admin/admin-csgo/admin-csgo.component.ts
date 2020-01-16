import { Component } from '@angular/core';
import { TournamentCSGORegistration,
  getEmptyNewCSGOGroup,
  TournamentGroup } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';
import { IDropDroppedEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-admin-csgo',
  templateUrl: './admin-csgo.component.html',
  styleUrls: ['./admin-csgo.component.scss']
})
export class AdminCsgoComponent {
  public registrations: TournamentCSGORegistration [];
  public noGroupParticipants: TournamentCSGORegistration [];
  public groups: TournamentGroup [];
  public loading = false;
  public environment = environment;
  public newGroup = getEmptyNewCSGOGroup();

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.csgoRegistrations.subscribe(data => {
      if (data) {
        this.registrations = data;
        this.noGroupParticipants = data.filter(r => !r.TournamentCSGOGroupId);
      }
    });
    this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data);
    this.apiService.getCSGOGroups().subscribe(data => this.groups = data);
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
    this.apiService.deleteCSGOGroup(id).subscribe(_ => this.groups.splice(this.groups.indexOf(this.groups.find(g => g.Id === id)), 1));
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.Id).subscribe();
    if (!group.Participants) {
      group.Participants = [ event.dragData ];
    } else {
      group.Participants.push(event.dragData);
      event.dragData.TournamentCSGOGroupId = group.Id;
      this.noGroupParticipants.splice(this.noGroupParticipants.indexOf(event.dragData), 1);
    }
  }
}
