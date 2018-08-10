import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SteamUser, SteamUserWithStats } from '../models/steamuser';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { IgxChipsAreaComponent } from '../../../node_modules/igniteui-angular';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerDetailsComponent {

  public authUser: SteamUser;
  public player: SteamUserWithStats;
  public selectedDay: string;
  public weekDays = [
    { day: 'Mondays', available: false },
    { day: 'Tuesdays', available: false },
    { day: 'Wednesdays', available: false },
    { day: 'Thursdays', available: true },
    { day: 'Fridays', available: false },
    { day: 'Saturdays', available: false },
    { day: 'Sundays', available: false }
  ];

  @ViewChild(IgxChipsAreaComponent) public chips: IgxChipsAreaComponent;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute) {
    this.authManager.steamUser.subscribe((data: SteamUser) => {
      this.authUser = data;
    });

    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      this.apiService.getUser(userid).subscribe(
        data => {
          this.player = data;
          this.chips.chipsList.forEach((item, index) => {
            const temp = item.selectable;
            item.selectable = true;
            item.selected = this.weekDays[index].available;
            item.selectable = temp;
          });
        }
      );
    });
  }

  public playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.steamID64);
  }
}
