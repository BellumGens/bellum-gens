import { Component } from '@angular/core';
import { TournamentGroup,
  TournamentRegistration,
  getEmptyNewSC2Group} from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { environment } from '../../../../src-common/environments/environment';
import { IDropDroppedEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-admin-sc2',
  templateUrl: './admin-sc2.component.html',
  styleUrls: ['./admin-sc2.component.scss']
})
export class AdminSc2Component {
  public registrations: TournamentRegistration [];
  public groups: TournamentGroup [];
  public loading = false;
  public environment = environment;
  public newGroup = getEmptyNewSC2Group();
  public pipeTrigger = 0;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.sc2Registrations.subscribe(data => {
      if (data) {
        this.registrations = data;
      }
    });
    this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
    this.apiService.getSC2Groups().subscribe(data => this.groups = data);
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
}
