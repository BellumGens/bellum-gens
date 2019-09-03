import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss']
})
export class TournamentHomeComponent implements OnInit {
  public authUser: ApplicationUser;

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private title: Title) {
    this.title.setTitle('Esports Business League: Sign-up');
  }

  ngOnInit() {
  }

}
