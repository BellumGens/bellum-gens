import { Component } from '@angular/core';
import { CSGOTeam } from '../../models/csgoteam';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent extends BaseComponent {
  public csgoTeams: CSGOTeam [];
  public loading = true;

  constructor(private apiManager: BellumgensApiService) {
    super();
    this.subs.push(this.apiManager.loadingTeams.subscribe(loading => this.loading = loading));
    this.subs.push(this.apiManager.csgoTeams.subscribe(data => {
      this.csgoTeams = data;
    }));
  }
}
