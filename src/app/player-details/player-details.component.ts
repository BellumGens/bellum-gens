import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SteamUser, SteamUserWithStats, DayOfWeek } from '../models/steamuser';
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
    'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'
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
            item.selected = this.player.availability[index].Available;
            item.selectable = temp;
          });
        }
      );
    });
  }

  public dayName(day: DayOfWeek) {
    return this.weekDays[day];
  }

  public playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.steamID64);
  }
}
