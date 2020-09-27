import { Component } from '@angular/core';
import { TournamentRegistration, TournamentGroup } from '../../../../src-common/models/tournament';
import { ApiTournamentsService } from '../../../../src-common/services/bellumgens-api.tournaments.service';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { environment } from '../../../../src-common/environments/environment';
import { DataType, FilteringExpressionsTree, FilteringLogic, GridSelectionMode, IgxDateFilteringOperand } from '@infragistics/igniteui-angular';
import { TournamentCSGOMatch } from '../../../../src-common/models/tournament-schedule';

@Component({
  selector: 'app-tournament-csgo',
  templateUrl: './tournament-csgo.component.html',
  styleUrls: ['./tournament-csgo.component.scss']
})
export class TournamentCsgoComponent extends BaseComponent {
  public registrations: TournamentRegistration [];
  public groups: TournamentGroup [];
  public loading = false;
  public loadingMatches = false;
  public authUser: ApplicationUser;
  public tournamentId: string;
  public environment = environment;
  public selectionMode = GridSelectionMode;
  public gridDataType = DataType;
  public csgomatches: TournamentCSGOMatch [];
  public initialFilter: FilteringExpressionsTree;

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.subs.push(
      this.activeRoute.params.subscribe(params => {
        this.tournamentId = params['tournamentid'];
      }),
      this.apiService.csgoRegistrations.subscribe(data => this.registrations = data),
      this.apiService.loadingCSGORegistrations.subscribe(data => this.loading = data),
      this.loginService.applicationUser.subscribe(user => this.authUser = user),
      this.apiService.loadingCSGOMatches.subscribe(data => this.loadingMatches = data),
      this.apiService.csgoMatches.subscribe(data => {
        if (data) {
          data.forEach(item => item.StartTime = new Date(item.StartTime));
          this.csgomatches = data;
        }
      })
    );
    this.apiService.getCSGOGroups().subscribe(data => this.groups = data);

    const gridFilteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And);
    const productFilteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And, 'StartTime');
    const productExpression = {
        condition: IgxDateFilteringOperand.instance().condition('after'),
        fieldName: 'StartTime',
        searchVal: new Date(2020, 8, 27)
    };
    productFilteringExpressionsTree.filteringOperands.push(productExpression);
    gridFilteringExpressionsTree.filteringOperands.push(productFilteringExpressionsTree);
    this.initialFilter = gridFilteringExpressionsTree;
  }
}
