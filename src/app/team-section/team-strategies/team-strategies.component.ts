import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { TeamStrategy, Side } from 'src/app/models/csgoteamstrategy';
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
  teamId: string;
  newStrategy: TeamStrategy = {
    Id: '',
    TeamId: '',
    Side: Side.TSide,
    Title: '',
    Description: '',
    Url: ''
  };

  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.teamId = params['teamid'];

      if (this.teamId) {
        this.apiService.getTeamStrats(this.teamId).subscribe(strats => this.teamStrats = strats);
        this.apiService.getTeamMapPool(this.teamId).subscribe(maps => this.maps = maps);
      }
    });
  }

  public changeMaps(args: MapPool) {
    this.apiService.setTeamMapPool(args).subscribe(
      success => this.toast.showSuccess('Map pool updated successfully!'),
      error => this.toast.showError(error.error.Message)
    );
  }

  public submitStrategy() {
    this.newStrategy.TeamId = this.teamId;
  }

}
