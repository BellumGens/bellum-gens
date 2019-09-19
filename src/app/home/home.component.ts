import { Component, HostListener } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { BaseComponent } from '../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { SocialMediaService } from '../services/social-media.service';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public navigation = window.matchMedia('(min-width: 768px)').matches;

  constructor(private authManager: LoginService,
              private commService: CommunicationService,
              private title: Title,
              private meta: Meta,
              private socialMedia: SocialMediaService) {
    super();
    this.title.setTitle('Bellum Gens: CS:GO team management');
    this.meta.updateTag({ name: 'description',
      content: 'CSGO Strategy editor | CSGO team finding and management | Bellum Gens: Looking for Group'});
    this.commService.title = 'Bellum Gens';
    this.subs.push(this.authManager.applicationUser.subscribe(data => this.authUser = data));
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @BellumGens...');
  }

  @HostListener('window:resize')
  public resize() {
    this.navigation = window.matchMedia('(min-width: 768px)').matches;
  }

}
