import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TournamentParticipant, TournamentGroup, ApplicationUser, TournamentSC2Match, Tournament, ApiTournamentsService, LoginService, Sc2MapNamePipe } from '../../../../../common/src/public_api';
import { DatePipe } from '@angular/common';
import { IGX_CARD_DIRECTIVES, IgxCircularProgressBarComponent, IgxAvatarComponent, IgxBadgeComponent, IgxDividerDirective, IGX_GRID_DIRECTIVES, IgxIconComponent } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-bge-balkan',
  templateUrl: './bge-balkan.component.html',
  styleUrl: './bge-balkan.component.scss',
  imports: [
    DatePipe,
    RouterLink,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IgxAvatarComponent,
    IgxBadgeComponent,
    IgxDividerDirective,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    Sc2MapNamePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgeBalkanComponent extends BaseDirective {
  public registrations: TournamentParticipant [];
  public groups: TournamentGroup [];
  public loading = false;
  public loadingMatches = false;
  public authUser: ApplicationUser;
  public tournamentId: string;
  public sc2matches: TournamentSC2Match [];
  public tournament: Tournament;

  constructor(private apiService: ApiTournamentsService,
              private loginService: LoginService,
              title: Title,
              meta: Meta,
              route: ActivatedRoute) {
    super(title, meta, route);
    this.loginService.applicationUser.subscribe(user => this.authUser = user);

    this.activeRoute.params.subscribe(params => {
      this.tournamentId = params['tournamentid'];
      if (this.tournamentId) {
        this.apiService.getTournament(this.tournamentId).subscribe(t => this.tournament = t);
        this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
        this.apiService.getSc2Registrations(this.tournamentId).subscribe(data => this.registrations = data);
        this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
        this.apiService.getSc2Matches(this.tournamentId).subscribe(data => {
          if (data) {
            this.sc2matches = data;
          }
        });
        this.apiService.getSc2Groups(this.tournamentId).subscribe(data => this.groups = data);
      } else {
        this.apiService.activeTournament.subscribe(t => {
          if (t) {
            this.tournament = t;
            this.tournamentId = t.id;
            this.apiService.loadingSC2Registrations.subscribe(data => this.loading = data);
            this.apiService.getSc2Registrations(this.tournamentId).subscribe(data => this.registrations = data);
            this.apiService.loadingSC2Matches.subscribe(data => this.loadingMatches = data);
            this.apiService.getSc2Matches(this.tournamentId).subscribe(matches => {
              if (matches) {
                this.sc2matches = matches;
              }
            });
            this.apiService.getSc2Groups(this.tournamentId).subscribe(data => this.groups = data);
          }
        });
      }
    });
  }
}
