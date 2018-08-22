import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SteamUser, SteamUserWithStats, DayOfWeek, Availability } from '../models/steamuser';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import {
  IgxChipsAreaComponent,
  IgxTimePickerComponent,
  IgxTimePickerValueChangedEventArgs,
  IgxToastComponent,
  IgxToastPosition,
  IgxDropDownComponent,
  HorizontalAlignment,
  VerticalAlignment,
  ConnectedPositioningStrategy
} from '../../../node_modules/igniteui-angular';
import { noop } from 'rxjs';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerDetailsComponent {

  private _positionSettings = {
    horizontalStartPoint: HorizontalAlignment.Left,
    verticalStartPoint: VerticalAlignment.Bottom
  };

  private _overlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(this._positionSettings)
  };

  public authUser: SteamUser;
  public player: SteamUserWithStats;
  public selectedDay: Availability;
  public weekDays = [
    'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'
  ];

  @ViewChild(IgxChipsAreaComponent) public chips: IgxChipsAreaComponent;
  @ViewChild(IgxToastComponent) public error: IgxToastComponent;
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
          this.player = data;
          if (!data.userStats) {
            this.error.position = IgxToastPosition.Middle;
            this.error.displayTime = 7000;
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

  public getTime(date: Date | string): string {
    const value = this.dateFromString(date);
    return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  public daySelected(args: any) {
    const index = this.chips.chipsList.toArray().indexOf(args.owner);
    this.selectedDay = this.player.availability[index];
    if (!args.nextStatus) {
      this.selectedDay.Available = false;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => noop,
        error => console.log(error)
      );
    }
    this.cdr.detectChanges();
  }

  public fromChange(args: IgxTimePickerValueChangedEventArgs) {
    if (this.to.value) {
      this.selectedDay.From = args.newValue;
      this.selectedDay.To = this.to.value;
      this.selectedDay.Available = true;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => noop,
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
        data => noop,
        error => console.log(error)
      );
    }
  }

  public playerIsUser(): boolean {
    return this.player && this.authUser && (this.player.steamUser.steamID64 === this.authUser.steamID64);
  }

  public togglePrimary(args) {
    this._overlaySettings.positionStrategy.settings.target = args.target;
    this.primaryRole.toggle(this._overlaySettings);
  }

  public toggleSecondary(args) {
    this._overlaySettings.positionStrategy.settings.target = args.target;
    this.secondaryRole.toggle(this._overlaySettings);
  }
}
