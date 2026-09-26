import { Component, inject, Injector, PLATFORM_ID, Signal, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';

import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import {
  ApplicationUser,
  CSGOTeam, TEAM_PLACEHOLDER,
  BellumgensApiService,
  LoginService
} from '../../../../common/src/public_api';
import { isPlatformBrowser } from '@angular/common';
import { BaseDirective } from '../base/base.component';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective } from '@infragistics/igniteui-angular/card';
import { TeamApplicationComponent } from './team-application/team-application.component';

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
    RouterOutlet
  ]
})
export class TeamComponent extends BaseDirective {
  private apiService = inject(BellumgensApiService);
  private authManager = inject(LoginService);
  private iconService = inject(IgxIconService);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(Injector);

  public authUser: Signal<ApplicationUser> = this.authManager.applicationUser;
  // Handed down to the child routes through the router outlet.
  public team = signal<CSGOTeam>(TEAM_PLACEHOLDER);
  public isAdmin = signal(false);
  public isMember = signal(false);

  constructor() {
    super();
    this.activeRoute.params.pipe(
      map(params => params['teamid'] as string),
      filter(teamId => !!teamId),
      switchMap(teamId => toObservable(this.apiService.getTeam(teamId), { injector: this.injector })),
      filter(team => !!team),
      takeUntilDestroyed()
    ).subscribe(team => {
      this.team.set(team);
      this.authManager.getUserIsTeamMember(team.teamId).subscribe(data => this.isMember.set(data));
      this.authManager.getUserIsTeamAdmin(team.teamId).subscribe(data => this.isAdmin.set(data));
      this.titleService.setTitle('Counter-Strike Team: ' + team.teamName);
      this.loadSvgs();
    });
  }

  private loadSvgs() {
    if (isPlatformBrowser(this.platformId)) {
      this.iconService.addSvgIcon('discord-full-logo', '/assets/login/discord.svg', 'login-icons');
    }
  }

}
