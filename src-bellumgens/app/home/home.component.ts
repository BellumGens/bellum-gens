import { Component, HostListener, PLATFORM_ID } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { SocialMediaService } from '../../../src-common/services/social-media.service';
import { CommunicationService } from '../../../src-common/services/communication.service';
import { environment } from '../../../src-common/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public navigation: boolean;
  public environment = environment;

  constructor(private authManager: LoginService,
              private socialMedia: SocialMediaService,
              private commService: CommunicationService,
              titleService: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(titleService, meta, activeRoute);
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
    this.navigation = isPlatformBrowser(PLATFORM_ID) ? window.matchMedia('(min-width: 768px)').matches : true;
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @BellumGens...');
  }

  public openTeams() {
    this.commService.emitOpenTeams();
  }

  @HostListener('window:resize')
  public resize() {
    this.navigation = window.matchMedia('(min-width: 768px)').matches;
  }

  public navigateToEbleague() {
    window.location.href = this.environment.ebleague;
  }

}
