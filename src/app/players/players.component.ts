import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IgxFilterOptions } from 'igniteui-angular';
import { SteamUser } from '../models/steamuser';
import { BellumgensApiService } from '../services/bellumgens-api.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
  public searchContact: string;

  public activeUsers: SteamUser[];

  constructor(private apiManager: BellumgensApiService) {
    this.apiManager.activeUsers().subscribe((data: SteamUser[]) => this.activeUsers = data);
  }

  ngOnInit() { }

  get filterContacts() {
    const fo = new IgxFilterOptions();
    fo.key = 'steamID';
    fo.inputValue = this.searchContact;
    return fo;
  }
}
