import { Component, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { SocialMediaService } from '../../../src-common/services/social-media.service';
import { environment } from '../../../src-common/environments/environment';
import { BaseComponent } from '../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IgxCarouselComponent } from '@infragistics/igniteui-angular';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent {
  @ViewChild(IgxCarouselComponent, { static: true }) public carousel: IgxCarouselComponent;

  public authUser: ApplicationUser;
  public navigation = true;
  public environment = environment;
  public userEmail: string = null;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private authManager: LoginService,
              private socialMedia: SocialMediaService,
              titleService: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(titleService, meta, activeRoute);
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
    this.resize();
  }

  @HostListener('window:resize')
  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.navigation = window.matchMedia('(min-width: 768px)').matches;
    }
  }

  public subscribe() {
    if (this.userEmail) {
      this.authManager.addSubscriber(this.userEmail).subscribe();
    }
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @BellumGens ...');
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

}
