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
  public title = 'Esports Business League';
  public environment = environment;
  private _headerTitle = 'Esports Business League';
  private _headerTitleShort = 'EBL';
  private isBrowser: boolean;

  @ViewChild('cookiesBanner', { static: true }) public banner: IgxBannerComponent;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private authManager: LoginService) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.title = window.matchMedia('(min-width: 768px)').matches ? this._headerTitle : this._headerTitleShort;
    } else {
      this.title = this._headerTitle;
    }
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

  @HostListener('window:resize')
  public resize() {
    this.title = window && window.matchMedia('(min-width: 768px)').matches ? this._headerTitle : this._headerTitleShort;
  }
}
