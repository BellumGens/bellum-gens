import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import {
  ISelectionEventArgs,
  IgxIconService
} from '@infragistics/igniteui-angular';

import { LoginService } from '../../../src-common/services/login.service';
import { BellumgensApiService } from '../../../src-common/services/bellumgens-api.service';
import { CSGOPlayer, WeaponDescriptor } from '../../../src-common/models/csgoplayer';
import { Availability } from '../../../src-common/models/playeravailability';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { CSGOTeam } from '../../../src-common/models/csgoteam';
import { CSGOMapPool } from '../../../src-common/models/csgomaps';
import { ALL_ROLES } from '../../../src-common/models/playerrole';
import { BaseComponent } from '../base/base.component';
import { Observable } from 'rxjs';
import { SortWeaponsPipe } from '../pipes/sort-weapons.pipe';

@Component({
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public teamsAdmin: CSGOTeam [];
  public userTeams: Observable<CSGOTeam []>;
  public availability: Availability [];
  public mapPool: Observable<CSGOMapPool []>;
  public player: CSGOPlayer;
  public newUser = false;
  public roles = ALL_ROLES;
  public viewAll = false;
  public loading = false;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute,
              private iconService: IgxIconService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.subs.push(
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        if (data) {
          this.authUser = data;
          this.authManager.teamsAdmin.subscribe(teams => this.teamsAdmin = teams);
        }
      }),
      this.activatedRoute.params.subscribe(params => {
        const userid = params['userid'];
        this.newUser = params['newuser'];
        if (userid) {
          this.subs.push(this.apiService.getPlayer(userid).subscribe(
              player => {
                if (player) {
                  this.player = player;
                  if (player && !player.steamUserException) {
                    this.titleService.setTitle('CS:GO Player: ' + player.steamUser.steamID);
                    if (player.registered) {
                      this.userTeams = this.apiService.getUserTeams(player.id);
                      this.apiService.getAvailability(player.id).subscribe(data => this.availability = data);
                      this.mapPool = this.apiService.getMapPool(player.id);
                    }
                    if (player.userStats) {
                      const weapons = new SortWeaponsPipe().transform(player.userStats.weapons);
                      this.loadSvgs(weapons);
                    }
                  }

                }
              }
            ),
            this.apiService.loadingPlayer.subscribe(loading => this.loading = loading)
          );
        }
      })
    );
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public submitAvailability(args: Availability) {
    // this.authUser.availability.find(a => a.Day === args.Day).Available = args.Available;
    this.apiService.setAvailability(args).subscribe();
  }

  public get playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.id);
  }

  public selectPrimary(value: number) {
    this.apiService.setPrimaryRole(this.roles.find(r => r.id === value)).subscribe();
  }

  public selectSecondary(value: number) {
    this.apiService.setSecondaryRole(this.roles.find(r => r.id === value)).subscribe();
  }

  public mapChange(args: CSGOMapPool) {
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser, args.newSelection.value).subscribe();
  }

  private loadSvgs(weapons: WeaponDescriptor []) {
    weapons.forEach(w => {
      if (!this.iconService.isSvgIconCached(w.name, 'weapon-icons')) {
        this.iconService.addSvgIcon(w.name, `/assets/weapon-icons/svg_normal/weapon_${w.name}.svg`, 'weapon-icons');
      }
    });
  }
}
