import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  Tournament,
  TournamentParticipant,
  TournamentVisibility,
  TournamentStatus,
  Game,
  getTournamentStatus,
  TournamentSC2Match,
  TournamentCSGOMatch,
  TournamentDota2Match
} from 'bellum-gens-common/models';
import { ApiTournamentsService, LoginService } from 'bellum-gens-common/services';
import { CountrySVGPipe, RaceIconPipe, ParticipantTeamPipe } from 'bellum-gens-common/pipes';
import { map } from 'rxjs/operators';
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
  imports: [
    DatePipe,
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
    ParticipantTeamPipe,
    RaceIconPipe
  ]
})
export class TournamentDetailComponent {
  private apiService = inject(ApiTournamentsService);
  private activeRoute = inject(ActivatedRoute);
  private loginService = inject(LoginService);

  private tournamentId = toSignal(this.activeRoute.params.pipe(map(params => params['tournamentId'] as string)));

  public tournament = computed<Tournament | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getTournament(id)() ?? null : null;
  });
  public loading = computed(() => !this.tournament());
  // Each game's data is only loaded for tournaments of that game (or of no specific game)
  private sc2DataId = computed(() => {
    const t = this.tournament();
    return t?.id && (t.game === Game.StarCraft2 || t.game == null) ? t.id : null;
  });
  private csgoDataId = computed(() => {
    const t = this.tournament();
    return t?.id && (t.game === Game.CSGO || t.game == null) ? t.id : null;
  });
  public registrations = computed<TournamentParticipant[]>(() => {
    const id = this.sc2DataId();
    return id ? this.apiService.getSc2Registrations(id)() ?? [] : [];
  });
  public sc2Matches = computed<TournamentSC2Match[] | null>(() => {
    const id = this.sc2DataId();
    return id ? this.apiService.getSc2Matches(id)() : null;
  });
  public csgoMatches = computed<TournamentCSGOMatch[] | null>(() => {
    const id = this.csgoDataId();
    return id ? this.apiService.getCsgoMatches(id)() : null;
  });
  public loadingRegistrations = this.apiService.loadingSC2Registrations;

  /** Dota 2 is played by teams, so a Dota 2 tournament lists teams and series instead of players and matches. */
  public isDota2 = computed(() => this.tournament()?.game === Game.Dota2);
  // Only loaded for Dota 2 tournaments; tournaments without a game predate Dota 2 support
  private dota2DataId = computed(() => {
    const t = this.tournament();
    return t?.id && t.game === Game.Dota2 ? t.id : null;
  });
  public dota2Registrations = computed<TournamentParticipant[]>(() => {
    const id = this.dota2DataId();
    return id ? this.apiService.getDota2Registrations(id)() ?? [] : [];
  });
  public dota2Matches = computed<TournamentDota2Match[] | null>(() => {
    const id = this.dota2DataId();
    return id ? this.apiService.getDota2Matches(id)() : null;
  });
  public loadingDota2Registrations = this.apiService.loadingDota2Registrations;

  private authUser = this.loginService.applicationUser;

  public isOwner = computed(() => {
    const t = this.tournament();
    const user = this.authUser();
    return t && user && t.creatorId === user.id;
  });

  public canJoin = computed(() => {
    const t = this.tournament();
    return t && t.status === TournamentStatus.Open && t.visibility !== TournamentVisibility.Private;
  });

  /** The tournament status, derived from the active flag and the dates when the tournament has none. */
  public status = computed(() => getTournamentStatus(this.tournament()));

  public statusLabel = computed(() => {
    switch (this.status()) {
      case TournamentStatus.Draft: return 'Draft';
      case TournamentStatus.Open: return 'Open';
      case TournamentStatus.InProgress: return 'In Progress';
      case TournamentStatus.Completed: return 'Completed';
      case TournamentStatus.Cancelled: return 'Cancelled';
      default: return '';
    }
  });

  public visibilityIcon = computed(() => {
    const t = this.tournament();
    if (!t) return 'public';
    switch (t.visibility) {
      case TournamentVisibility.Public: return 'public';
      case TournamentVisibility.Private: return 'lock';
      case TournamentVisibility.InviteOnly: return 'mail';
      default: return 'public';
    }
  });
}
