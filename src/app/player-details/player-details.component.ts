import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SteamUser, SteamUserWithStats, DayOfWeek, Availability, MapPool } from '../models/steamuser';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import {
  IgxChipsAreaComponent,
  IgxTimePickerComponent,
  IgxTimePickerValueChangedEventArgs,
  IgxToastComponent,
  IgxToastPosition,
  IgxDropDownComponent,
  ISelectionEventArgs,
  IChangeCheckboxEventArgs,
  IChipSelectEventArgs
} from '../../../node_modules/igniteui-angular';

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

  public activeDuty = [
    { id: 0, map: 'Cache', image: 'assets/csgo_maps/CSGO_Cache_A_site.jpg', active: true },
    { id: 1, map: 'Dust 2', image: 'assets/csgo_maps/320px-Csgo_dust2.0.jpg', active: true },
    { id: 2, map: 'Inferno', image: 'assets/csgo_maps/320px-De_new_inferno.jpg', active: true },
    { id: 3, map: 'Mirage', image: 'assets/csgo_maps/320px-Csgo_mirage.jpg', active: true },
    { id: 4, map: 'Nuke', image: 'assets/csgo_maps/320px-Nuke_csgo.jpg', active: true },
    { id: 5, map: 'Overpass', image: 'assets/csgo_maps/320px-Csgo_overpass.jpg', active: true },
    { id: 6, map: 'Train', image: 'assets/csgo_maps/320px-Train_csgo.jpg', active: true }
  ];

  @ViewChild(IgxChipsAreaComponent) public chips: IgxChipsAreaComponent;
  @ViewChild('error') public error: IgxToastComponent;
  @ViewChild('saveSuccess') public success: IgxToastComponent;
  @ViewChild('from') public from: IgxTimePickerComponent;
  @ViewChild('to') public to: IgxTimePickerComponent;
  @ViewChild('primaryRole') public primaryRole: IgxDropDownComponent;
  @ViewChild('secondaryRole') public secondaryRole: IgxDropDownComponent;

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
          data.mapPool.sort(m => m.IsPlayed ? 0 : 1);
          this.player = data;
          if (!data.userStats) {
            this.error.position = IgxToastPosition.Middle;
            this.error.show();
          }
          // Waiting on the chip bug fix to be released.
          this.cdr.detectChanges();
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

  public dateFromString(date: Date | string): Date {
    return new Date(date);
  }

  public mapName(map: MapPool) {
    return this.activeDuty.find(m => m.id === map.Map).map;
  }

  public mapImage(map: MapPool) {
    return this.activeDuty.find(m => m.id === map.Map).image;
  }

  public getTime(date: Date | string): string {
    const value = this.dateFromString(date);
    return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  public daySelected(args: IChipSelectEventArgs) {
    const index = this.chips.chipsList.toArray().indexOf(args.owner);
    this.selectedDay = this.player.availability[index];
    if (!args.selected) {
      this.selectedDay.Available = false;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => this.showSuccess(),
        error => console.log(error)
      );
      this.selectedDay = null;
    }
    this.cdr.detectChanges();
  }

  public fromChange(args: IgxTimePickerValueChangedEventArgs) {
    if (this.to.value) {
      this.selectedDay.From = args.newValue;
      this.selectedDay.To = this.to.value;
      this.selectedDay.Available = true;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => this.showSuccess(),
        error => console.log(error)
      );
    }
  }

  public toChange(args) {
    if (this.from.value) {
      this.selectedDay.To = args.newValue;
      this.selectedDay.From = this.from.value;
      this.selectedDay.Available = true;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => this.showSuccess(),
        error => console.log(error)
      );
    }
  }

  public playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.steamID64);
  }

  public selectPrimary(args: ISelectionEventArgs) {
    if (!args.oldSelection) {
      return;
    }
    const index = this.primaryRole.items.indexOf(args.newSelection);
    if (this.player.primaryRole !== this.player.roles[index].Id) {
      this.player.primaryRole = this.player.roles[index].Id;
      this.apiService.setPrimaryRole(this.player.roles[index]).subscribe(
        data => this.showSuccess(),
        error => console.log(error)
      );
    }
  }

  public selectSecondary(args: ISelectionEventArgs) {
    if (!args.oldSelection) {
      return;
    }
    const index = this.secondaryRole.items.indexOf(args.newSelection);
    if (this.player.secondaryRole !== this.player.roles[index].Id) {
      this.player.secondaryRole = this.player.roles[index].Id;
      this.apiService.setSecondaryRole(this.player.roles[index]).subscribe(
        data => this.showSuccess(),
        error => console.log(error)
      );
    }
  }

  public mapChange(args: IChangeCheckboxEventArgs) {
    this.player.mapPool.find(m => m.Map === args.checkbox.value.Map).IsPlayed = args.checked;
    this.player.mapPool.sort(m => m.IsPlayed ? 0 : 1);
    this.apiService.setMapPool(args.checkbox.value).subscribe(
      data => this.showSuccess(),
      error => console.log(error)
    );
  }

  public showSuccess() {
    this.success.show();
  }
}
