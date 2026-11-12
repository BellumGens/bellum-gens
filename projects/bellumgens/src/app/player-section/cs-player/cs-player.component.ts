import { Component, computed, effect, inject, linkedSignal, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseDirective } from '../../base/base.component';
import {
  ALL_ROLES,
  ApplicationUser,
  Availability,
  CSGODetails,
  CSGOMapPool,
  CSGOTeam,
  PlaystyleRole,
  WeaponDescriptor
} from 'bellum-gens-common/models';
import { AvailabilityComponent, LoadingComponent } from 'bellum-gens-common';
import { BellumgensApiService, LoginService } from 'bellum-gens-common/services';
import { CountrySVGPipe } from 'bellum-gens-common/pipes';
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
  public player = inject(ROUTER_OUTLET_DATA) as Signal<ApplicationUser | null>;

  public authUser: Signal<ApplicationUser | null> = this.authManager.applicationUser;
  // Only pull the admin teams once a user is logged in.
  public teamsAdmin = computed<CSGOTeam [] | null>(() => this.authUser() ? this.authManager.teamsAdmin() : null);
  public userTeams = signal<CSGOTeam []>([]);
  public availability = signal<Availability [] | null>(null);
  public mapPool = signal<CSGOMapPool [] | null>(null);
  public viewAll = signal(false);
  public loading = this.apiService.loadingPlayer;
  public roles = ALL_ROLES;

  public newUser = toSignal(
    (this.activatedRoute.parent ?? this.activatedRoute).params.pipe(map(params => !!params['newuser'])),
    { initialValue: false }
  );

  // Locally editable copy of the roles, so a pick shows up immediately instead of
  // waiting for the server. Re-seeds whenever a new player comes down from the parent.
  public csgoDetails = linkedSignal<Partial<CSGODetails> | undefined>(() => this.player()?.csgoDetails);

  public playerIsUser = computed(() => {
    const player = this.player();
    const authUser = this.authUser();
    return !!player && !!authUser && player.steamUser?.steamID64 === authUser.steamId;
  });

  private detailsLoadedFor?: string;

  constructor() {
    super();

    effect(() => {
      const player = this.player();
      if (!player || player.steamUserException) {
        return;
      }
      this.titleService.setTitle('Counter-Strike Player: ' + (player.steamUser?.steamID ?? ''));

      // The player object is replaced whenever a role changes, so only pull the
      // rest of the profile once per player.
      if (this.detailsLoadedFor === player.id) {
        return;
      }
      // Don't carry the previous player's profile over while this one loads (or if it has none).
      this.userTeams.set([]);
      this.availability.set(null);
      this.mapPool.set(null);
      this.detailsLoadedFor = player.id;
      if (player.registered) {
        // A response that arrives after the parent switched to another player is dropped.
        const isCurrent = () => this.player()?.id === player.id;
        this.apiService.getUserTeams(player.id).subscribe(teams => {
          if (isCurrent()) {
            this.userTeams.set(teams);
          }
        });
        this.apiService.getAvailability(player.id).subscribe(data => {
          if (isCurrent()) {
            this.availability.set(data);
          }
        });
        this.apiService.getMapPool(player.id).subscribe(maps => {
          if (isCurrent()) {
            this.mapPool.set(maps);
          }
        });
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
    const user = this.authUser();
    if (!user) {
      return;
    }
    args.userId = user.id;
    this.apiService.setAvailability(args).subscribe();
  }

  public selectPrimary(value: PlaystyleRole) {
    this.csgoDetails.update(details => ({ ...details, primaryRole: value }));
    const role = this.roles.find(r => r.id === value);
    const player = this.player();
    if (role && player) {
      this.apiService.setPrimaryRole(role, player.id).subscribe();
    }
  }

  public selectSecondary(value: PlaystyleRole) {
    this.csgoDetails.update(details => ({ ...details, secondaryRole: value }));
    const role = this.roles.find(r => r.id === value);
    const player = this.player();
    if (role && player) {
      this.apiService.setSecondaryRole(role, player.id).subscribe();
    }
  }

  public mapChange(args: CSGOMapPool) {
    const user = this.authUser();
    if (!user) {
      return;
    }
    args.userId = user.id;
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    const steamUser = this.player()?.steamUser;
    if (steamUser) {
      this.apiService.inviteToTeam(steamUser, args.newSelection.value).subscribe();
    }
  }

  private loadSvgs(weapons: WeaponDescriptor [] | null) {
    weapons?.forEach(w => {
      this.iconService.addSvgIcon(w.name, `/assets/weapon-icons/svg_normal/weapon_${w.name}.svg`, 'weapon-icons');
    });
  }
}
