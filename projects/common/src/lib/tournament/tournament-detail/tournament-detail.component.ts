import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
import { map } from 'rxjs/operators';
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
    RaceIconPipe
  ]
})
export class TournamentDetailComponent {
  private apiService = inject(ApiTournamentsService);
  private activeRoute = inject(ActivatedRoute);
  private loginService = inject(LoginService);

  private tournamentId = toSignal(this.activeRoute.params.pipe(map(params => params['tournamentId'] as string)));

  public tournament = computed<Tournament | null>(() => this.tournamentId() ? this.apiService.getTournament(this.tournamentId())() ?? null : null);
  public loading = computed(() => !this.tournament());
  // Each game's data is only loaded for tournaments of that game (or of no specific game)
  private hasSc2Data = computed(() => this.tournament() && (this.tournament().game === Game.StarCraft2 || this.tournament().game == null));
  private hasCsgoData = computed(() => this.tournament() && (this.tournament().game === Game.CSGO || this.tournament().game == null));
  public registrations = computed<TournamentParticipant[]>(() =>
    this.hasSc2Data() ? this.apiService.getSc2Registrations(this.tournament().id)() ?? [] : []);
  public sc2Matches = computed<TournamentSC2Match[] | null>(() =>
    this.hasSc2Data() ? this.apiService.getSc2Matches(this.tournament().id)() : null);
  public csgoMatches = computed<TournamentCSGOMatch[] | null>(() =>
    this.hasCsgoData() ? this.apiService.getCsgoMatches(this.tournament().id)() : null);
  public loadingRegistrations = this.apiService.loadingSC2Registrations;

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

  public statusLabel = computed(() => {
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
