import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { ApplicationUser, CSGOTeam, SteamGroup, EMPTY_NEW_TEAM, Game, TEAM_GAMES, gameName } from 'bellum-gens-common/models';
import { BellumgensApiService } from 'bellum-gens-common/services';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_RADIO_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/radio';
import { IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { Router } from '@angular/router';
import { GroupsFilterPipe } from '../../pipes/groups-filter.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss'],
  imports: [
    IgxDialogComponent,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    FormsModule,
    IGX_LIST_DIRECTIVES,
    IgxAvatarComponent,
    IGX_RADIO_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    GroupsFilterPipe,
    IgxIconButtonDirective
  ]
})
export class TeamNewComponent {
  private apiService = inject(BellumgensApiService);
  private router = inject(Router);

  public authUser = input<ApplicationUser | null>();
  /** Emits the team once it has been created. */
  public created = output<CSGOTeam>();

  public createTeam = viewChild(IgxDialogComponent);

  public groups = signal<SteamGroup [] | undefined>(undefined);
  public searchGroups = signal('');
  public newTeam = Object.assign({}, EMPTY_NEW_TEAM);
  public navigateOnCreate = true;
  public inProgress = signal(false);
  /** The game of the new team, whether it comes from a Steam group or from the form. */
  public game = signal<Game>(Game.CSGO);
  /** The caller decided the game (e.g. a Dota 2 league registration), so there is nothing to choose. */
  public gameFixed = signal(false);
  public readonly teamGames = TEAM_GAMES.map(id => ({ id, name: gameName(id) }));

  /**
   * Opens the dialog.
   * @param navigate whether to go to the page of the team once it has been created
   * @param game the game the team must be for; without it the user chooses the game
   */
  public open(navigate = true, game?: Game) {
    this.navigateOnCreate = navigate;
    this.gameFixed.set(game !== undefined);
    if (game !== undefined) {
      this.game.set(game);
    }
    const steamId = this.authUser()?.steamId;
    if (steamId) {
      this.apiService.getPlayerGroups(steamId).subscribe(groups => this.groups.set(groups));
    }
    this.createTeam()?.open();
  }

  public createFromSteam(group: SteamGroup) {
    this.inProgress.set(true);
    this.apiService.registerSteamGroup(group, this.game()).subscribe({
      next: team => this.teamCreated(team),
      error: () => this.inProgress.set(false)
    });
  }

  public createFromForm() {
    this.inProgress.set(true);
    this.apiService.registerTeam({ ...this.newTeam, game: this.game() }).subscribe({
      next: team => this.teamCreated(team),
      error: () => this.inProgress.set(false)
    });
  }

  private teamCreated(team: CSGOTeam) {
    this.inProgress.set(false);
    this.createTeam()?.close();
    this.created.emit(team);
    if (this.navigateOnCreate) {
      this.router.navigate(['/team', team.customUrl]);
    }
  }
}
