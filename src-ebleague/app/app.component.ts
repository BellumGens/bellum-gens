import { Component, OnInit, ViewChild, HostListener, PLATFORM_ID, Inject } from '@angular/core';

import { IgxBannerComponent} from 'igniteui-angular';
import { LoginService } from '../../src-common/services/login.service';
import { ApplicationUser } from '../../src-common/models/applicationuser';
import { environment } from '../../src-common/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public authUser: ApplicationUser;
  public environment = environment;
  private isBrowser: boolean;

  @ViewChild('cookiesBanner', { static: true }) public banner: IgxBannerComponent;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private authManager: LoginService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.authManager.applicationUser.subscribe(data => {
      this.authUser = data;
    });
  }

  public ngOnInit(): void {
    if (this.isBrowser && !window.localStorage.getItem('cookiesAccepted')) {
      this.banner.open();
    }
  }

  public acceptCookies() {
    this.banner.close();
    window.localStorage.setItem('cookiesAccepted', 'true');
  }

  public navigateToBG() {
    window.location.href = this.environment.bellumgens;
  }
}
