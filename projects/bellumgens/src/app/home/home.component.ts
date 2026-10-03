import { Component, PLATFORM_ID, Signal, inject, signal, viewChild } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { LoginService, ApplicationUser, SocialMediaService } from '../../../../common/src/public_api';
import { environment } from '../../../../common/src/environments/environment';
import { BaseDirective } from '../base/base.component';
import { RouterLink } from '@angular/router';
import { IGX_CAROUSEL_DIRECTIVES, IgxCarouselComponent } from '@infragistics/igniteui-angular/carousel';
import { IgxButtonDirective, IgxDividerComponent } from '@infragistics/igniteui-angular/directives';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(window:resize)': 'resize()'
  },
  imports: [
    RouterLink,
    NgOptimizedImage,
    FormsModule,
    IgxDividerComponent,
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

  public carousel = viewChild(IgxCarouselComponent);

  // The user is only looked up in the browser.
  public authUser: Signal<ApplicationUser> = isPlatformBrowser(this.platformId)
    ? this.authManager.applicationUser
    : signal<ApplicationUser>(null).asReadonly();
  public navigation = signal(true);
  public environment = environment;
  public userEmail = signal<string>(null);

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.resize();
    }
  }

  public resize() {
    this.navigation.set(window.matchMedia('(min-width: 768px)').matches);
  }

  public subscribe() {
    const email = this.userEmail();
    if (email) {
      this.authManager.addSubscriber(email).subscribe();
    }
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @BellumGens ...');
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }
}
