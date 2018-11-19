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
import { SuccessErrorComponent } from '../success-error/success-error.component';
import { MapPool } from '../models/csgomaps';

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
  public newUser = false;

  @ViewChild(IgxChipsAreaComponent) public chips: IgxChipsAreaComponent;
  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;
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
      this.newUser = params['newuser'];

      this.apiService.getUser(userid).subscribe(
        data => {
          this.player = data;
          if (data.userStatsException) {
            this.toast.showError('Account is private!', IgxToastPosition.Middle);
          }
        }
      );
    });
  }

  public dateFromString(date: string): Date {
    return new Date(date);
  }

  public daySelected(args: IChipSelectEventArgs) {
    if (this.chips && args.originalEvent) {
      const index = this.chips.chipsList.toArray().indexOf(args.owner);
      this.selectedDay = this.player.availability[index];

      if (!args.selected) {
        args.cancel = true;
      }
      this.cdr.detectChanges();
    }
  }

  public dayDeselected(args: IBaseChipEventArgs) {
    this.selectedDay.Available = false;
    this.apiService.setAvailability(this.selectedDay).subscribe(
      data => this.toast.showSuccess(),
      error => this.toast.showError()
    );
    this.selectedDay = null;
  }

  public fromChange(args: IgxTimePickerValueChangedEventArgs) {
    if (this.to.value) {
      this.selectedDay.From = args.newValue;
      this.selectedDay.To = this.to.value;
      this.selectedDay.Available = true;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => this.toast.showSuccess(),
        error => this.toast.showError()
      );
    }
  }

  public toChange(args) {
    if (this.from.value) {
      this.selectedDay.To = args.newValue;
      this.selectedDay.From = this.from.value;
      this.selectedDay.Available = true;
      this.apiService.setAvailability(this.selectedDay).subscribe(
        data => this.toast.showSuccess(),
        error => this.toast.showError()
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
        data => this.toast.showSuccess(),
        error => this.toast.showError()
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
        data => this.toast.showSuccess(),
        error => this.toast.showError()
      );
    }
  }

  public mapChange(args: MapPool) {
    this.apiService.setMapPool(args).subscribe(
      data => this.toast.showSuccess('Map pool updated successfully!'),
      error => this.toast.showError(error.error.Message)
    );
  }

  public inviteToTeam(args: ISelectionEventArgs) {
    this.apiService.inviteToTeam(this.player.steamUser.steamID64, args.newSelection.value).subscribe(
      data => this.toast.showSuccess('Invite sent!'),
      error => this.toast.showError('Something went wrong. Invitation not sent!')
    );
  }
}
