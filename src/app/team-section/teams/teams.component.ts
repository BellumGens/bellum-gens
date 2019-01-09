import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { CSGOTeam } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  public csgoTeams: Observable<CSGOTeam []>;

  @ViewChild('teams') public teams: IgxListComponent;

  constructor(private apiManager: BellumgensApiService) {
  }

  ngOnInit() {
    this.csgoTeams = this.apiManager.csgoTeams;
  }
}
