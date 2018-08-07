import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SteamUser } from '../models/steamuser';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerDetailsComponent {

  public steamUser: SteamUser;

  constructor(private authManager: LoginService,
              private router: Router) {
    this.authManager.steamUser.subscribe((data: SteamUser) => {
      this.steamUser = data;
    }, (error) => {
      this.router.navigateByUrl('/players');
    });
  }
}
