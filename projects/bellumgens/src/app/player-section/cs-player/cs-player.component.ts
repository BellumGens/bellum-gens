import { Component, computed, effect, inject, linkedSignal, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseDirective } from '../../base/base.component';
import {
  ALL_ROLES,
  ApplicationUser,
  Availability,
  AvailabilityComponent,
  BellumgensApiService,
  CountrySVGPipe,
  CSGOMapPool,
  CSGOTeam,
  LoadingComponent,
  LoginService,
  PlaystyleRole,
  WeaponDescriptor
} from '../../../../../common/src/public_api';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, ROUTER_OUTLET_DATA } from '@angular/router';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxButtonDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IGX_DROP_DOWN_DIRECTIVES, ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { map } from 'rxjs/operators';
import { SortWeaponsPipe } from '../../pipes/sort-weapons.pipe';
import { SteamCustomUrlPipe } from '../../pipes/steam-custom-url.pipe';
import { TopWeaponAltPipe } from '../../pipes/top-weapon-alt.pipe';
import { MapPoolComponent } from '../map-pool/map-pool.component';

@Component({
  selector: 'app-cs-player',
  imports: [
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
    CountrySVGPipe,
    SteamCustomUrlPipe,
    SortWeaponsPipe,
    TopWeaponAltPipe,
    LoadingComponent
  ],
  templateUrl: './cs-player.component.html',
  styleUrl: './cs-player.component.scss'
})
export class CsPlayerComponent extends BaseDirective {
  private authManager = inject(LoginService);
  private apiService = inject(BellumgensApiService);
  private activatedRoute = inject(ActivatedRoute);
  private iconService = inject(IgxIconService);

  // Handed down by the parent PlayerComponent through the router outlet.
  public player = inject(ROUTER_OUTLET_DATA) as Signal<ApplicationUser>;

  public authUser: Signal<ApplicationUser> = this.authManager.applicationUser;
  // Only pull the admin teams once a user is logged in.
  public teamsAdmin = computed<CSGOTeam []>(() => this.authUser() ? this.authManager.teamsAdmin() : null);
  public userTeams = signal<CSGOTeam []>([]);
  public availability = signal<Availability []>(null);
  public mapPool = signal<CSGOMapPool []>(null);
  public viewAll = signal(false);
  public loading = this.apiService.loadingPlayer;
  public roles = ALL_ROLES;

  public newUser = toSignal(
    this.activatedRoute.parent.params.pipe(map(params => !!params['newuser'])),
    { initialValue: false }
  );

  // Locally editable copy of the roles, so a pick shows up immediately instead of
  // waiting for the server. Re-seeds whenever a new player comes down from the parent.
  public csgoDetails = linkedSignal(() => this.player()?.csgoDetails);

  public playerIsUser = computed(() => {
    const player = this.player();
    const authUser = this.authUser();
    return !!player && !!authUser && player.steamUser.steamID64 === authUser.steamId;
  });

  private detailsLoadedFor: string;

  constructor() {
    super();

    effect(() => {
      const player = this.player();
      if (!player || player.steamUserException) {
        return;
      }
      this.titleService.setTitle('Counter-Strike Player: ' + player.steamUser.steamID);

      // The player object is replaced whenever a role changes, so only pull the
      // rest of the profile once per player.
      if (this.detailsLoadedFor === player.id) {
        return;
      }
      this.userTeams.set([]);
      this.detailsLoadedFor = player.id;
      if (player.registered) {
        const requestedPlayerId = player.id;
        this.apiService.getUserTeams(player.id).subscribe(teams => {
          if (this.player()?.id === requestedPlayerId) {
            this.userTeams.set(teams);
          }
        });
        this.apiService.getAvailability(player.id).subscribe(data => this.availability.set(data));
        this.apiService.getMapPool(player.id).subscribe(maps => this.mapPool.set(maps));
      }
      if (player.userStats) {
        this.loadSvgs(new SortWeaponsPipe().transform(player.userStats.weapons));
      }
    });
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public submitAvailability(args: Availability) {
    args.userId = this.authUser().id;
    this.apiService.setAvailability(args).subscribe();
  }

  public selectPrimary(value: PlaystyleRole) {
    this.csgoDetails.update(details => ({ ...details, primaryRole: value }));
    this.apiService.setPrimaryRole(this.roles.find(r => r.id === value), this.player().id).subscribe();
  }

  public selectSecondary(value: PlaystyleRole) {
    this.csgoDetails.update(details => ({ ...details, secondaryRole: value }));
    this.apiService.setSecondaryRole(this.roles.find(r => r.id === value), this.player().id).subscribe();
  }

  public mapChange(args: CSGOMapPool) {
    args.userId = this.authUser().id;
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player().steamUser, args.newSelection.value).subscribe();
  }

  private loadSvgs(weapons: WeaponDescriptor []) {
    weapons.forEach(w => {
      this.iconService.addSvgIcon(w.name, `/assets/weapon-icons/svg_normal/weapon_${w.name}.svg`, 'weapon-icons');
    });
  }
}
