import { Component, OnInit, Input } from '@angular/core';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { CSGOTeam } from 'src/app/models/csgoteam';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css']
})
export class TeamPreferencesComponent implements OnInit {
  @Input()
  team: CSGOTeam;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public updateTeamInfo() {
    this.apiService.updateTeam(this.team).subscribe(team => this.team = team);
  }
}
