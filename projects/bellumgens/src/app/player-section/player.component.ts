import { Component, Signal, ViewEncapsulation, inject, linkedSignal, signal } from '@angular/core';

import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApplicationUser } from 'bellum-gens-common/models';
import { BellumgensApiService } from 'bellum-gens-common/services';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    IGX_TABS_DIRECTIVES,
    IgxAvatarComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class PlayerComponent {
  private apiService = inject(BellumgensApiService);
  private activatedRoute = inject(ActivatedRoute);

  private cachedPlayer = signal<Signal<ApplicationUser | null> | null>(null);

  // Keeps showing the previous player while the next one loads (the service cache is cleared meanwhile).
  public player = linkedSignal<ApplicationUser | null, ApplicationUser | null>({
    source: () => this.cachedPlayer()?.() ?? null,
    computation: (player, previous) => player ?? previous?.value ?? null
  });

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      if (userid) {
        this.cachedPlayer.set(this.apiService.getPlayer(userid));
      }
    });
  }
}
