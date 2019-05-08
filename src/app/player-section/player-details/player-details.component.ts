import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import {
  IgxDropDownComponent,
  ISelectionEventArgs
} from '../../../../node_modules/igniteui-angular';
import { CSGOPlayer } from '../../models/csgoplayer';
import { Availability } from '../../models/playeravailability';
import { ApplicationUser } from '../../models/applicationuser';
import { CSGOTeam } from '../../models/csgoteam';
import { MapPool } from '../../models/csgomaps';
import { ALL_ROLES } from '../../models/playerrole';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerDetailsComponent implements OnInit {

  public authUser: ApplicationUser;
  public teamsAdmin: CSGOTeam [];
  public player: CSGOPlayer;
  public newUser = false;
  public roles = ALL_ROLES;
  public viewAll = false;

  @ViewChild('primaryRole') public primaryRole: IgxDropDownComponent;
  @ViewChild('secondaryRole') public secondaryRole: IgxDropDownComponent;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      this.authUser = data;
    });
    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      this.newUser = params['newuser'];
      if (userid !== '0') {
        this.apiService.getPlayer(userid).subscribe(
          data => {
            this.player = data;
          }
        );
      }
    });
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

  public mapChange(args: MapPool) {
    this.authUser.mapPool.find(m => m.Map === args.Map).IsPlayed = args.IsPlayed;
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser, args.newSelection.value).subscribe();
  }
}
