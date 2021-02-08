import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';

import { IgxBannerComponent, IgxNavigationDrawerComponent} from '@infragistics/igniteui-angular';
import { LoginService } from '../../src-common/services/login.service';
import { ApplicationUser } from '../../src-common/models/applicationuser';
import { environment } from '../../src-common/environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('cookiesBanner', { static: true }) public banner: IgxBannerComponent;

  @ViewChild('drawer', { static: true }) public navdrawer: IgxNavigationDrawerComponent;

  public authUser: ApplicationUser;
  public environment = environment;

  constructor(@Inject(LOCALE_ID) public localeId: string,
              private authManager: LoginService,
              private router: Router) {
    this.authManager.applicationUser.subscribe(data => {
      this.authUser = data;
    });
  }

  public ngOnInit(): void {
    if (!window?.localStorage?.getItem('cookiesAccepted')) {
      this.banner.open();
    }

    this.router.events.pipe(
      filter(x => x instanceof NavigationEnd)
    )
    .subscribe(() => this.navdrawer.close());
  }

  public acceptCookies() {
    this.banner.close();
    window.localStorage.setItem('cookiesAccepted', 'true');
  }
}
