import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, AsyncPipe } from '@angular/common';
import {
  Tournament,
  TournamentParticipant,
  TournamentVisibility,
  TournamentStatus,
  Game
} from '../../../models/tournament';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../services/login.service';
import { CountrySVGPipe } from '../../pipes/country-svg.pipe';
import { RaceIconPipe } from '../../pipes/race-icon.pipe';
import { Observable } from 'rxjs';
import { TournamentSC2Match, TournamentCSGOMatch } from '../../../models/tournament-schedule';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';

@Component({
  selector: 'bg-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrl: './tournament-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    AsyncPipe,
    RouterLink,
    IGX_CARD_DIRECTIVES,
    IgxAvatarComponent,
    IgxIconComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxChipComponent,
    IgxCircularProgressBarComponent,
    IGX_TABS_DIRECTIVES,
    CountrySVGPipe,
    RaceIconPipe
  ]
})
export class TournamentDetailComponent {
  private apiService = inject(ApiTournamentsService);
  private activeRoute = inject(ActivatedRoute);
  private loginService = inject(LoginService);

  tournament = signal<Tournament | null>(null);
  loading = signal(true);
  registrations: Observable<TournamentParticipant[]>;
  sc2Matches: Observable<TournamentSC2Match[]>;
  csgoMatches: Observable<TournamentCSGOMatch[]>;
  loadingRegistrations: Observable<boolean>;

  TournamentStatus = TournamentStatus;
  TournamentVisibility = TournamentVisibility;
  Game = Game;

  isOwner = computed(() => {
    const t = this.tournament();
    const user = this.loginService.applicationUser?.value;
    return t && user && t.creatorId === user.id;
  });

  canJoin = computed(() => {
    const t = this.tournament();
    return t && t.status === TournamentStatus.Open && t.visibility !== TournamentVisibility.Private;
  });

  get statusLabel(): string {
    const t = this.tournament();
    if (!t) return '';
    switch (t.status) {
      case TournamentStatus.Draft: return 'Draft';
      case TournamentStatus.Open: return 'Open';
      case TournamentStatus.InProgress: return 'In Progress';
      case TournamentStatus.Completed: return 'Completed';
      case TournamentStatus.Cancelled: return 'Cancelled';
      default: return '';
    }
  }

  get visibilityIcon(): string {
    const t = this.tournament();
    if (!t) return 'public';
    switch (t.visibility) {
      case TournamentVisibility.Public: return 'public';
      case TournamentVisibility.Private: return 'lock';
      case TournamentVisibility.InviteOnly: return 'mail';
      default: return 'public';
    }
  }

  constructor() {
    this.loadingRegistrations = this.apiService.loadingSC2Registrations;

    this.activeRoute.params.subscribe(params => {
      if (params['tournamentId']) {
        this.apiService.getTournament(params['tournamentId']).subscribe(t => {
          if (t) {
            this.tournament.set(t);
            this.loading.set(false);

            if (t.game === Game.StarCraft2 || !t.game) {
              this.registrations = this.apiService.getSc2Registrations(t.id);
              this.sc2Matches = this.apiService.getSc2Matches(t.id);
            }
            if (t.game === Game.CSGO || !t.game) {
              this.csgoMatches = this.apiService.getCsgoMatches(t.id);
            }
          }
        });
      }
    });
  }
}
