import { Component, computed, DestroyRef, effect, inject, signal, Signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { LoadingComponent } from 'bellum-gens-common';
import { ApplicationUser, Dota2Profile } from 'bellum-gens-common/models';
import { BellumgensApiService } from 'bellum-gens-common/services';
import { Dota2HeroNamePipe } from '../../pipes/dota2-hero-name.pipe';
import { MatchDurationPipe } from '../../pipes/match-duration.pipe';
import { SteamCustomUrlPipe } from '../../pipes/steam-custom-url.pipe';

@Component({
  selector: 'app-dota-player',
  imports: [
    IgxAvatarComponent,
    IGX_CARD_DIRECTIVES,
    IGX_GRID_DIRECTIVES,
    IGX_LIST_DIRECTIVES,
    IgxCircularProgressBarComponent,
    LoadingComponent,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    Dota2HeroNamePipe,
    MatchDurationPipe,
    SteamCustomUrlPipe
  ],
  templateUrl: './dota-player.component.html',
  styleUrl: './dota-player.component.scss'
})
export class DotaPlayerComponent {
  private titleService = inject(Title);
  private apiService = inject(BellumgensApiService);

  // Handed down by the parent PlayerComponent through the router outlet.
  public player = inject(ROUTER_OUTLET_DATA) as Signal<ApplicationUser | null>;

  public profile = signal<Dota2Profile | null>(null);
  public profileError = signal(false);
  private loadingProfile = signal(false);
  public loading = computed(() => this.apiService.loadingPlayer() || this.loadingProfile());

  /** The Steam account the shown (or loading) stats belong to. */
  private profileLoadedFor?: string;
  private profileRequest?: Subscription;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.profileRequest?.unsubscribe());
    effect(() => {
      const player = this.player();
      if (!player) {
        // The parent is loading the next player
        return;
      }
      const steamUser = player.steamUser;
      if (!steamUser?.steamID64) {
        // A player without a Steam account has no stats; drop those of the previous player, loaded or not
        this.resetProfile();
        return;
      }
      this.titleService.setTitle($localize`:@@dota2PlayerTitle:Dota 2 Player: ${steamUser.steamID}:name:`);

      // The parent hands down a new object for the same player on every refresh,
      // so only pull the stats once per Steam account.
      const steamId = steamUser.steamID64;
      if (this.profileLoadedFor === steamId) {
        return;
      }
      // A request still running for the previous player is cancelled, so it can't overwrite these stats
      this.resetProfile();
      this.profileLoadedFor = steamId;
      this.loadingProfile.set(true);
      this.profileRequest = this.apiService.getDota2Profile(steamId).subscribe({
        next: profile => {
          this.profile.set(profile);
          this.loadingProfile.set(false);
        },
        error: () => {
          this.profileError.set(true);
          this.loadingProfile.set(false);
          // Coming back to the player tries again
          this.profileLoadedFor = undefined;
        }
      });
    });
  }

  private resetProfile() {
    this.profileRequest?.unsubscribe();
    this.profileRequest = undefined;
    this.profileLoadedFor = undefined;
    this.profile.set(null);
    this.profileError.set(false);
    this.loadingProfile.set(false);
  }
}
