import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss']
})
export class TournamentHomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public userEmail: string = null;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private title: Title) {
    super();
    this.title.setTitle('Esports Business League: Sign-up');
    this.subs.push(
      this.authManager.applicationUser.subscribe(user => this.authUser = user)
    );
  }
}
