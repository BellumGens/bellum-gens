import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { TeamStrategy, Side } from 'src/app/models/csgoteamstrategy';
import { MapPool, CSGOMap, ActiveDutyDescriptor, ActiveDuty } from 'src/app/models/csgomaps';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';
import { IgxDialogComponent } from 'igniteui-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent implements OnInit {
  teamStrats: TeamStrategy [];
  maps: MapPool [];
  mapList: ActiveDutyDescriptor [] = ActiveDuty;
  teamId: string;
  newStrategy: TeamStrategy = {
    Id: '',
    TeamId: '',
    Side: Side.TSide,
    Title: '',
    Description: '',
    Url: '',
    Map: CSGOMap.Cache
  };
  sanitizedUrl: SafeResourceUrl;
  videoId: string;

  private _youtubeRegEx = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;

  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;
  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private sanitizer: DomSanitizer) {
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

  public openNewStrategy(side: Side) {
    this.newStrategy.Side = side;
    this.dialog.open();
  }

  public selectMap(args) {
    this.newStrategy.Map = args.newSelection.value;
  }

  public editStrategy(strat: TeamStrategy) {
    this.newStrategy = strat;
    this.dialog.open();
  }

  public submitStrategy() {
    this.newStrategy.TeamId = this.teamId;
    this.apiService.submitStrategy(this.newStrategy).subscribe(
      success => {
        this.teamStrats.push(this.newStrategy);
        this.dialog.close();
        this.toast.showSuccess('Update submitted successfully!');
      },
      error => this.toast.showError(error.error.Message)
    );
  }

  public getVideoEmbedLink() {
    if (this._youtubeRegEx.test(this.newStrategy.Url)) {
      const parts = this._youtubeRegEx.exec(this.newStrategy.Url);
      if (this.videoId && this.videoId === parts[5]) {
        return true;
      }
      this.videoId = parts[5];
      this.sanitizedUrl = this.getYoutubeEmbedLink(this.newStrategy.Url);
      return true;
    }
    return false;
  }

  public getYoutubeEmbedLink(url: string): SafeResourceUrl {
    const parts = this._youtubeRegEx.exec(url);
    return this.getSanitizedUrl(`https://www.youtube.com/embed/${parts[5]}`);
  }

  public getSanitizedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
