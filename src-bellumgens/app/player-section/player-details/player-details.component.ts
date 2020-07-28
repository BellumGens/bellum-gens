import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import {
  IgxDropDownComponent,
  ISelectionEventArgs,
  IgxIconService
} from '@infragistics/igniteui-angular';

import { LoginService } from '../../../../src-common/services/login.service';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { CSGOPlayer } from '../../../../src-common/models/csgoplayer';
import { Availability } from '../../../../src-common/models/playeravailability';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { CSGOTeam } from '../../../../src-common/models/csgoteam';
import { CSGOMapPool } from '../../../../src-common/models/csgomaps';
import { ALL_ROLES } from '../../../../src-common/models/playerrole';
import { BaseComponent } from '../../base/base.component';

@Component({
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerDetailsComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public teamsAdmin: CSGOTeam [];
  public player: CSGOPlayer;
  public newUser = false;
  public roles = ALL_ROLES;
  public viewAll = false;
  public loading = false;

  @ViewChild('primaryRole') public primaryRole: IgxDropDownComponent;
  @ViewChild('secondaryRole') public secondaryRole: IgxDropDownComponent;

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
        this.authUser = data;
      }),
      this.activatedRoute.params.subscribe(params => {
        const userid = params['userid'];
        this.newUser = params['newuser'];
        if (userid) {
          this.subs.push(this.apiService.getPlayer(userid).subscribe(
              player => {
                this.player = player;
                if (player && !player.steamUserException) {
                  this.titleService.setTitle('CS:GO Player: ' + player.steamUser.steamID);
                }
              }
            ),
            this.apiService.loadingPlayer.subscribe(loading => this.loading = loading)
          );
        }
      })
    );
    this.loadSvgs();
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public submitAvailability(args: Availability) {
    this.authUser.availability.find(a => a.Day === args.Day).Available = args.Available;
    this.apiService.setAvailability(args).subscribe();
  }

  public get playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.id);
  }

  public selectPrimary(value: number) {
    if (this.player.primaryRole !== value) {
      this.player.primaryRole = value;
      this.authUser.primaryRole = value;
      this.apiService.setPrimaryRole(this.roles.find(r => r.Id === value)).subscribe();
    }
  }

  public selectSecondary(value: number) {
    if (this.player.secondaryRole !== value) {
      this.player.secondaryRole = value;
      this.authUser.secondaryRole = value;
      this.apiService.setSecondaryRole(this.roles.find(r => r.Id === value)).subscribe();
    }
  }

  public mapChange(args: CSGOMapPool) {
    this.authUser.mapPool.find(m => m.Map === args.Map).IsPlayed = args.IsPlayed;
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser, args.newSelection.value).subscribe();
  }

  private loadSvgs() {
    this.iconService.addSvgIcon('ak47', '/assets/weapon-icons/svg_normal/weapon_ak47.svg', 'weapon-icons');
    this.iconService.addSvgIcon('awp', '/assets/weapon-icons/svg_normal/weapon_awp.svg', 'weapon-icons');
    this.iconService.addSvgIcon('aug', '/assets/weapon-icons/svg_normal/weapon_aug.svg', 'weapon-icons');
    this.iconService.addSvgIcon('bizon', '/assets/weapon-icons/svg_normal/weapon_bizon.svg', 'weapon-icons');
    this.iconService.addSvgIcon('deagle', '/assets/weapon-icons/svg_normal/weapon_deagle.svg', 'weapon-icons');
    this.iconService.addSvgIcon('famas', '/assets/weapon-icons/svg_normal/weapon_famas.svg', 'weapon-icons');
    this.iconService.addSvgIcon('fiveseven', '/assets/weapon-icons/svg_normal/weapon_fiveseven.svg', 'weapon-icons');
    this.iconService.addSvgIcon('g3sg1', '/assets/weapon-icons/svg_normal/weapon_g3sg1.svg', 'weapon-icons');
    this.iconService.addSvgIcon('galilar', '/assets/weapon-icons/svg_normal/weapon_galilar.svg', 'weapon-icons');
    this.iconService.addSvgIcon('glock', '/assets/weapon-icons/svg_normal/weapon_glock.svg', 'weapon-icons');
    this.iconService.addSvgIcon('m4a1', '/assets/weapon-icons/svg_normal/weapon_m4a1.svg', 'weapon-icons');
    this.iconService.addSvgIcon('m4a1_silencer', '/assets/weapon-icons/svg_normal/weapon_m4a1_silencer.svg', 'weapon-icons');
    this.iconService.addSvgIcon('hkp2000', '/assets/weapon-icons/svg_normal/weapon_usp_silencer.svg', 'weapon-icons');
    this.iconService.addSvgIcon('sg556', '/assets/weapon-icons/svg_normal/weapon_sg556.svg', 'weapon-icons');
    this.iconService.addSvgIcon('p90', '/assets/weapon-icons/svg_normal/weapon_p90.svg', 'weapon-icons');
    this.iconService.addSvgIcon('ump45', '/assets/weapon-icons/svg_normal/weapon_ump45.svg', 'weapon-icons');
    this.iconService.addSvgIcon('tec9', '/assets/weapon-icons/svg_normal/weapon_tec9.svg', 'weapon-icons');
    this.iconService.addSvgIcon('p250', '/assets/weapon-icons/svg_normal/weapon_p250.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mac10', '/assets/weapon-icons/svg_normal/weapon_mac10.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mp7', '/assets/weapon-icons/svg_normal/weapon_mp7.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mp9', '/assets/weapon-icons/svg_normal/weapon_mp9.svg', 'weapon-icons');
    this.iconService.addSvgIcon('ssg08', '/assets/weapon-icons/svg_normal/weapon_ssg08.svg', 'weapon-icons');
    this.iconService.addSvgIcon('xm1014', '/assets/weapon-icons/svg_normal/weapon_xm1014.svg', 'weapon-icons');
    this.iconService.addSvgIcon('hegrenade', '/assets/weapon-icons/svg_normal/weapon_hegrenade.svg', 'weapon-icons');
    this.iconService.addSvgIcon('scar20', '/assets/weapon-icons/svg_normal/weapon_scar20.svg', 'weapon-icons');
    this.iconService.addSvgIcon('negev', '/assets/weapon-icons/svg_normal/weapon_negev.svg', 'weapon-icons');
    this.iconService.addSvgIcon('knife', '/assets/weapon-icons/svg_normal/weapon_knife.svg', 'weapon-icons');
    this.iconService.addSvgIcon('molotov', '/assets/weapon-icons/svg_normal/weapon_molotov.svg', 'weapon-icons');
    this.iconService.addSvgIcon('nova', '/assets/weapon-icons/svg_normal/weapon_nova.svg', 'weapon-icons');
    this.iconService.addSvgIcon('mag7', '/assets/weapon-icons/svg_normal/weapon_mag7.svg', 'weapon-icons');
    this.iconService.addSvgIcon('m249', '/assets/weapon-icons/svg_normal/weapon_m249.svg', 'weapon-icons');
    this.iconService.addSvgIcon('elite', '/assets/weapon-icons/svg_normal/weapon_elite.svg', 'weapon-icons');
    this.iconService.addSvgIcon('sawedoff', '/assets/weapon-icons/svg_normal/weapon_sawedoff.svg', 'weapon-icons');
    this.iconService.addSvgIcon('taser', '/assets/weapon-icons/svg_normal/weapon_taser.svg', 'weapon-icons');
    this.iconService.addSvgIcon('flashbang', '/assets/weapon-icons/svg_normal/weapon_flashbang.svg', 'weapon-icons');
    this.iconService.addSvgIcon('smoke', '/assets/weapon-icons/svg_normal/weapon_smokegrenade.svg', 'weapon-icons');
    this.iconService.addSvgIcon('c4', '/assets/weapon-icons/svg_normal/weapon_c4.svg', 'weapon-icons');
  }
}
