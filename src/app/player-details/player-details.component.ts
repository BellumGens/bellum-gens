import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
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
  IChipSelectEventArgs,
  IBaseChipEventArgs
} from '../../../node_modules/igniteui-angular';
import { CSGOPlayer } from '../models/csgoplayer';
import { Availability } from '../models/playeravailability';
import { ApplicationUser } from '../models/applicationuser';
import { CSGOTeam } from '../models/csgoteam';

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
  public selectedDay: Availability;

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
  }

  ngOnInit() {
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      this.authUser = data;
    });
    this.activatedRoute.params.subscribe(params => {
      const userid = params['userid'];
      this.apiService.getUser(userid).subscribe(
        data => {
          this.player = data;
          if (data.userStatsException) {
            this.error.position = IgxToastPosition.Middle;
            this.error.show();
          }
        }
      );
    });
  }

  public dateFromString(date: string): Date {
    return new Date(date);
  }

  public daySelected(args: IChipSelectEventArgs) {
    if (this.chips) {
      const index = this.chips.chipsList.toArray().indexOf(args.owner);
      this.selectedDay = this.player.availability[index];

      if (!args.selected) {
        args.cancel = true;
      } else {
        this.cdr.detectChanges();
      }
    }
  }

  public dayDeselected(args: IBaseChipEventArgs) {
    this.selectedDay.Available = false;
    this.apiService.setAvailability(this.selectedDay).subscribe(
      data => this.success.show(),
      error => console.log(error)
    );
    this.selectedDay = null;
  }

  public fromChange(args: IgxTimePickerValueChangedEventArgs) {
    if (this.to.value) {
      this.selectedDay.From = args.newValue;
      this.selectedDay.To = this.to.value;
      this.selectedDay.Available = true;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => this.success.show(),
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
        data => this.success.show(),
        error => console.log(error)
      );
    }
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
      this.apiService.setPrimaryRole(this.player.roles[index]).subscribe(
        data => this.success.show(),
        error => this.error.show()
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
        data => this.success.show(),
        error => this.error.show()
      );
    }
  }

  public mapChange(args: IChangeCheckboxEventArgs) {
    args.checkbox.value.IsPlayed = args.checked;
    this.apiService.setMapPool(args.checkbox.value).subscribe(
      data => this.success.show(),
      error => this.error.show()
    );
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser.steamID64, args.newSelection.value).subscribe(
      data => this.success.show(),
      error => {
        this.error.message = 'Something went wrong. Invitation not sent!';
        this.error.show();
      }
    );
  }
}
