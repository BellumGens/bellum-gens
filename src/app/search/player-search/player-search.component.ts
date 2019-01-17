import { Component, OnInit, Input } from '@angular/core';
import { PLAYER_SEARCH, PlayerSearch } from 'src/app/models/csgoplayer';
import { PlaystyleRole } from 'src/app/models/playerrole';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { ISelectionEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent implements OnInit {
  public searchModel: PlayerSearch = PLAYER_SEARCH;

  @Input()
  public authUser: ApplicationUser;

  public userOverlap = 0;

  public teamName = 'Select Team';

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor(private apiManager: BellumgensApiService) { }

  ngOnInit() {
  }

  public searchPlayers() {
    if (!this.userOverlap) {
      this.teamName = 'Select Team';
      delete this.searchModel.teamId;
    }
    this.apiManager.searchPlayers(this.searchModel);
  }

  public selectTeam(args: ISelectionEventArgs) {
    this.teamName = args.newSelection.value.TeamName;
    this.searchModel.teamId = args.newSelection.value.TeamId;
  }

}
