import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { BaseComponent } from '../base/base.component';
import { Title } from '@angular/platform-browser';
import { SocialMediaService } from '../services/social-media.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {
  authUser: ApplicationUser;

  constructor(private authManager: LoginService, private title: Title, private socialMedia: SocialMediaService) {
    super();
    this.title.setTitle('Bellum Gens: CS:GO team management');
    this.subs.push(this.authManager.applicationUser.subscribe(data => this.authUser = data));
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @BellumGens');
  }

}
