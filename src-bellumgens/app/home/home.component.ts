import { Component, HostListener, PLATFORM_ID, ViewChild, OnInit, Inject } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { SocialMediaService } from '../../../src-common/services/social-media.service';
import { CommunicationService } from '../../../src-common/services/communication.service';
import { environment } from '../../../src-common/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IgxCarouselComponent } from 'igniteui-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {
  public authUser: ApplicationUser;
  public navigation = true;
  public environment = environment;

  @ViewChild(IgxCarouselComponent, { static: true })
  public carousel: IgxCarouselComponent;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
              private authManager: LoginService,
              private socialMedia: SocialMediaService,
              private commService: CommunicationService,
              titleService: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(titleService, meta, activeRoute);
    this.isBrowser = isPlatformBrowser(platformId);
    this.navigation = this.isBrowser ? window.matchMedia('(min-width: 768px)').matches : true;
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
  }

  public ngOnInit() {
    if (this.isBrowser) {
      this.carousel.interval = 10000;
    }
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
