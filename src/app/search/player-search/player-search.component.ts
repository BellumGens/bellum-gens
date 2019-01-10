import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PLAYER_SEARCH, PlayerSearch } from 'src/app/models/csgoplayer';
import { PlaystyleRole } from 'src/app/models/playerrole';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent implements OnInit {
  public searchModel: PlayerSearch = PLAYER_SEARCH;

  @Output()
  public search: EventEmitter<PlayerSearch> = new EventEmitter<PlayerSearch>();

  public activeLineup = [
    { roleName: 'IGL', role: PlaystyleRole.IGL },
    { roleName: 'Awper', role: PlaystyleRole.Awper },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger },
    { roleName: 'Support', role: PlaystyleRole.Support },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker }
  ];

  constructor() { }

  ngOnInit() {
  }

  public searchPlayers() {
    this.search.emit(this.searchModel);
  }

}
