import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { TeamStrategy } from 'src/app/models/csgoteamstrategy';
import { MapPool } from 'src/app/models/csgomaps';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent implements OnInit {
  teamStrats: TeamStrategy [];
  maps: MapPool [];

  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId) {
        this.apiService.getTeamStrats(teamId).subscribe(strats => this.teamStrats = strats);
        this.apiService.getTeamMapPool(teamId).subscribe(maps => this.maps = maps);
      }
    });
  }

  public changeMaps(args: MapPool) {
    this.apiService.setTeamMapPool(args).subscribe(
      success => this.toast.showSuccess('Map pool updated successfully!'),
      error => this.toast.showError(error.error.Message)
    );
  }

}
