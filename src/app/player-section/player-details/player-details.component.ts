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
    this.apiService.setAvailability(args).subscribe();
  }

  public get playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.SteamUser.steamID64);
  }

  public selectPrimary(args: ISelectionEventArgs) {
    if (!args.oldSelection) {
      return;
    }
    const index = this.primaryRole.items.indexOf(args.newSelection);
    if (this.player.primaryRole !== this.player.roles[index].Id) {
      this.player.primaryRole = this.player.roles[index].Id;
      this.apiService.setPrimaryRole(this.player.roles[index]).subscribe();
    }
  }

  public selectSecondary(args: ISelectionEventArgs) {
    if (!args.oldSelection) {
      return;
    }
    const index = this.secondaryRole.items.indexOf(args.newSelection);
    if (this.player.secondaryRole !== this.player.roles[index].Id) {
      this.player.secondaryRole = this.player.roles[index].Id;
      this.apiService.setSecondaryRole(this.player.roles[index]).subscribe();
    }
  }

  public mapChange(args: MapPool) {
    this.apiService.setMapPool(args).subscribe();
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser, args.newSelection.value).subscribe();
  }
}
