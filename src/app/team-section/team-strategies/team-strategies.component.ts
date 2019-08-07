import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOStrategy, VoteDirection } from '../../models/csgostrategy';
import { MapPool, AllMaps } from '../../models/csgomaps';
import { IChipSelectEventArgs } from 'igniteui-angular';
import { SafeResourceUrl, Title } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CSGOTeam } from '../../models/csgoteam';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { GlobalOverlaySettings } from '../../models/misc';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent extends BaseComponent {
  strats: CSGOStrategy [];
  maps: MapPool [] = AllMaps;
  team: CSGOTeam;
  authUser: ApplicationUser;
  sanitizedUrl: SafeResourceUrl;
  pipeTrigger = 0;
  changes = false;
  viewAll = false;
  selectedStrat: CSGOStrategy;
  loading = false;

  public overlaySettings = GlobalOverlaySettings;

  @Input()
  isAdmin = false;

  @Input()
  isEditor = false;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private authManager: LoginService,
              private title: Title) {
    super();
    this.subs.push(
      this.activatedRoute.parent.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => this.team = team);
          this.apiService.getTeamStrats(teamId).subscribe(strats => this.strats = strats);
          this.apiService.getTeamMapPool(teamId).subscribe(maps => this.maps = maps);
        } else {
          this.apiService.loadingStrategies.subscribe(loading => this.loading = loading),
          this.apiService.strategies.subscribe(strats => this.strats = strats);
          this.title.setTitle('CS:GO Strategies: find or create ');
        }
      }),
      this.authManager.applicationUser.subscribe(user => this.authUser = user)
    );
  }

  public changeMaps(event: IChipSelectEventArgs, args: MapPool) {
    if (event.originalEvent) {
      this.maps.find(m => m.Map === args.Map).IsPlayed = event.selected;
      this.changes = true;
      this.pipeTrigger++;
    }
  }

  public saveMaps(event: Event) {
    event.stopPropagation();
    this.apiService.setTeamMapPool(this.maps).subscribe(
      _ => {
        this.changes = false;
      }
    );
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiService.deleteStrategy(args.Id).subscribe(
      _ => {
        this.strats.splice(this.strats.indexOf(args), 1);
        this.pipeTrigger++;
      }
    );
  }

  public onStrategyAdded(strat: CSGOStrategy) {
    this.strats.push(strat);
    this.pipeTrigger++;
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    this.apiService.submitStratVote(strat, direction, this.authUser.id).subscribe(_ => this.pipeTrigger++);
  }
}
