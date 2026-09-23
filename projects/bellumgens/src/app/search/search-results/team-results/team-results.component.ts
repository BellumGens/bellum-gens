import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CSGOTeam, ApiSearchService } from '../../../../../../common/src/public_api';
import { BaseDirective } from '../../../base/base.component';
import { QueryParsedPipe } from '../../../pipes/query-parsed.pipe';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { LoadingComponent } from '../../../../../../common/src/lib/loading/loading.component';


@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./team-results.component.css'],  imports: [
    LoadingComponent,
    IGX_CARD_DIRECTIVES,
    RouterLink,
    IgxAvatarComponent,
    QueryParsedPipe
  ]
})
export class TeamResultsComponent extends BaseDirective {
  private apiService = inject(ApiSearchService);

  public teams = signal<CSGOTeam []>(null);
  public loading = toSignal(this.apiService.loadingSearch, { initialValue: false });
  public query = signal<string>(null);

  constructor() {
    super();
    this.activeRoute.params.subscribe(params => {
      if (params.query) {
        this.query.set(params.query);
        this.apiService.searchTeams(params.query);
      }
    });
    this.apiService.teamSearchResult.subscribe(players => this.teams.set(players));
  }
}
