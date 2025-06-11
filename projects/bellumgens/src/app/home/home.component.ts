import { Component, HostListener, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { LoginService, ApplicationUser, SocialMediaService } from '../../../../common/src/public_api';
import { environment } from '../../../../common/src/environments/environment';
import { BaseDirective } from '../base/base.component';
import { RouterLink } from '@angular/router';
import { IgxCarouselComponent, IgxDividerDirective, IGX_INPUT_GROUP_DIRECTIVES, IGX_CAROUSEL_DIRECTIVES, IgxIconComponent, IgxButtonDirective } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterLink,
    NgOptimizedImage,
    FormsModule,
    IgxDividerDirective,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_CAROUSEL_DIRECTIVES,
    IgxIconComponent,
    IgxButtonDirective
  ]
})
export class HomeComponent extends BaseDirective {
  private platformId = inject(PLATFORM_ID);
  private authManager = inject(LoginService);
  private socialMedia = inject(SocialMediaService);

  @ViewChild(IgxCarouselComponent, { static: true }) public carousel: IgxCarouselComponent;

  public authUser: ApplicationUser;
  public navigation = true;
  public environment = environment;
  public userEmail: string = null;

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.authManager.applicationUser.subscribe(data => this.authUser = data);
      this.resize();
    }
  }

  @HostListener('window:resize')
  public resize() {
    this.navigation = window.matchMedia('(min-width: 768px)').matches;
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
