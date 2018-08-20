import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SteamUser, SteamUserWithStats, DayOfWeek, Availability } from '../models/steamuser';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { IgxChipsAreaComponent, IgxTimePickerComponent } from '../../../node_modules/igniteui-angular';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerDetailsComponent {

  public authUser: SteamUser;
  public player: SteamUserWithStats;
  public selectedDay: Availability;
  public weekDays = [
    'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'
  ];

  @ViewChild(IgxChipsAreaComponent) public chips: IgxChipsAreaComponent;
  @ViewChild('from') public from: IgxTimePickerComponent;
  @ViewChild('to') public to: IgxTimePickerComponent;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private activatedRoute: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
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

  public daySelected(args: any) {
    const index = this.chips.chipsList.toArray().indexOf(args.owner);
    const availability = this.player.availability[index];
    this.selectedDay = this.player.availability[index];
    this.from.value = new Date(availability.From);
    this.to.value = new Date(availability.To);
    this.cdr.detectChanges();
  }

  public fromChange(args) {

  }

  public toChange(args) {

  }

  public playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.steamID64);
  }
}
