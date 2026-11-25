import { Component, computed, inject, Injector, PLATFORM_ID, Signal, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';

import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { ApplicationUser, CSGOTeam, Game, TEAM_PLACEHOLDER, teamGame } from 'bellum-gens-common/models';
import { BellumgensApiService, LoginService } from 'bellum-gens-common/services';
import { isPlatformBrowser } from '@angular/common';
import { BaseDirective } from '../base/base.component';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective } from '@infragistics/igniteui-angular/card';
import { TeamApplicationComponent } from './team-application/team-application.component';
import { TeamGameNamePipe } from '../pipes/team-game-name.pipe';

@Component({
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  imports: [
    IgxAvatarComponent,
    IgxCardHeaderTitleDirective,
    IgxCardHeaderSubtitleDirective,
    TeamApplicationComponent,
    IgxIconComponent,
    IGX_TABS_DIRECTIVES,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    TeamGameNamePipe
  ]
})
export class TeamComponent extends BaseDirective {
  private apiService = inject(BellumgensApiService);
  private authManager = inject(LoginService);
  private iconService = inject(IgxIconService);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(Injector);

  public authUser: Signal<ApplicationUser | null> = this.authManager.applicationUser;
  // Handed down to the child routes through the router outlet.
  public team = signal<CSGOTeam>(TEAM_PLACEHOLDER);
  public isAdmin = signal(false);
  public isMember = signal(false);
  /** Strategies are drawn on Counter-Strike maps, so only Counter-Strike teams have them. */
  public hasStrategies = computed(() => teamGame(this.team()) === Game.CSGO);

  constructor() {
    super();
    this.activeRoute.params.pipe(
      map(params => params['teamid'] as string),
      filter(teamId => !!teamId),
      // The service signal still holds the previous team until the requested one arrives
      switchMap(teamId => toObservable(this.apiService.getTeam(teamId), { injector: this.injector }).pipe(
        filter((team): team is CSGOTeam => team?.teamId === teamId || team?.customUrl === teamId)
      )),
      takeUntilDestroyed()
    ).subscribe(team => {
      this.team.set(team);
      const id = team.teamId;
      if (id) {
        this.authManager.getUserIsTeamMember(id).subscribe(data => this.isMember.set(data));
        this.authManager.getUserIsTeamAdmin(id).subscribe(data => this.isAdmin.set(data));
      }
      this.titleService.setTitle(teamGame(team) === Game.Dota2
        ? $localize`:@@dota2TeamTitle:Dota 2 Team: ${team.teamName}:name:`
        : $localize`:@@csTeamTitle:Counter-Strike Team: ${team.teamName}:name:`);
      this.loadSvgs();
    });
  }

  private loadSvgs() {
    if (isPlatformBrowser(this.platformId)) {
      this.iconService.addSvgIcon('discord-full-logo', '/assets/login/discord.svg', 'login-icons');
    }
  }

}
