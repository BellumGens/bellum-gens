import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import {
  ISelectionEventArgs,
  IgxIconService,
  IgxAvatarComponent,
  IgxButtonDirective,
  IgxRippleDirective,
  IgxToggleActionDirective,
  IgxIconComponent,
  IGX_DROP_DOWN_DIRECTIVES,
  IGX_SELECT_DIRECTIVES,
  IGX_CARD_DIRECTIVES,
  IgxCircularProgressBarComponent,
  IGX_LIST_DIRECTIVES
} from '@infragistics/igniteui-angular';

import {
  LoginService,
  BellumgensApiService,
  WeaponDescriptor,
  Availability,
  ApplicationUser,
  CSGOTeam,
  CSGOMapPool,
  ALL_ROLES
} from '../../../../common/src/public_api';

import { BaseDirective } from '../base/base.component';
import { Observable } from 'rxjs';
import { SortWeaponsPipe } from '../pipes/sort-weapons.pipe';
import { TopWeaponAltPipe } from '../pipes/top-weapon-alt.pipe';
import { SteamCustomUrlPipe } from '../pipes/steam-custom-url.pipe';
import { CountrySVGPipe } from '../../../../common/src/lib/pipes/country-svg.pipe';
import { MapPoolComponent } from './map-pool/map-pool.component';
import { AvailabilityComponent } from '../../../../common/src/lib/availability/availability.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../../../common/src/lib/loading/loading.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    LoadingComponent,
    IgxAvatarComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxToggleActionDirective,
    IgxIconComponent,
    IGX_DROP_DOWN_DIRECTIVES,
    RouterLink,
    IGX_SELECT_DIRECTIVES,
    FormsModule,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    AvailabilityComponent,
    IGX_LIST_DIRECTIVES,
    MapPoolComponent,
    AsyncPipe,
    CountrySVGPipe,
    SteamCustomUrlPipe,
    SortWeaponsPipe,
    TopWeaponAltPipe
  ]
})
export class PlayerComponent extends BaseDirective {
  public authUser: ApplicationUser;
  public teamsAdmin: CSGOTeam [];
  public userTeams: Observable<CSGOTeam []>;
  public availability: Availability [];
  public mapPool: CSGOMapPool [];
  public player: ApplicationUser;
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

    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      if (data) {
        this.authUser = data;
        this.authManager.teamsAdmin.subscribe(teams => this.teamsAdmin = teams);
      }
    });

    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      this.newUser = params['newuser'];
      if (userid) {
        this.apiService.getPlayer(userid).subscribe(
            player => {
              if (player) {
                this.player = player;
                if (player && !player.steamUserException) {
                  this.titleService.setTitle('CS:GO Player: ' + player.steamUser.steamID);
                  if (player.registered) {
                    this.userTeams = this.apiService.getUserTeams(player.id);
                    this.apiService.getAvailability(player.id).subscribe(data => this.availability = data);
                    this.apiService.getMapPool(player.id).subscribe(maps => this.mapPool = maps);
                  }
                  if (player.userStats) {
                    const weapons = new SortWeaponsPipe().transform(player.userStats.weapons);
                    this.loadSvgs(weapons);
                  }
                }
              }
            }
          );
          this.apiService.loadingPlayer.subscribe(loading => this.loading = loading);
      }
    });
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public submitAvailability(args: Availability) {
    args.userId = this.authUser.id;
    this.apiService.setAvailability(args).subscribe();
  }

  public get playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.steamId);
  }

  public selectPrimary(value: number) {
    this.apiService.setPrimaryRole(this.roles.find(r => r.id === value)).subscribe();
  }

  public selectSecondary(value: number) {
    this.apiService.setSecondaryRole(this.roles.find(r => r.id === value)).subscribe();
  }

  public mapChange(args: CSGOMapPool) {
    args.userId = this.authUser.id;
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser, args.newSelection.value).subscribe();
  }

  private loadSvgs(weapons: WeaponDescriptor []) {
    weapons.forEach(w => {
      this.iconService.addSvgIcon(w.name, `/assets/weapon-icons/svg_normal/weapon_${w.name}.svg`, 'weapon-icons');
    });
  }
}
