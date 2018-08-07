import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { IgxNavigationDrawerComponent,
  IgxDialogComponent,
  IgxToggleDirective,
  VerticalAlignment,
  HorizontalAlignment,
  ConnectedPositioningStrategy,
  CloseScrollStrategy,
  PositionSettings} from 'igniteui-angular';
import { LoginService } from './services/login.service';
import { SteamUser } from './models/steamuser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;
  public steamUser: SteamUser;

  private _positionSettings: PositionSettings = {
    horizontalStartPoint: HorizontalAlignment.Right,
    verticalStartPoint: VerticalAlignment.Bottom,
    horizontalDirection: HorizontalAlignment.Left
  };
  private _overlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(this._positionSettings),
    scrollStrategy: new CloseScrollStrategy()
  };

  @ViewChild(IgxNavigationDrawerComponent) public navdrawer: IgxNavigationDrawerComponent;
  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;
  @ViewChild(IgxToggleDirective) toggle: IgxToggleDirective;
  @ViewChild('userButton') public userButton: ElementRef;

  constructor(private router: Router,
              private authManager: LoginService) {
    if (!this.authManager.callMade) {
      this.authManager.getSteamUser();
    }
    this.authManager.steamUser.subscribe(data => this.steamUser = data);
  }

  public ngOnInit(): void {
    this.router.events.pipe(
      filter((x) => x instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
        if (event.url !== '/' && !this.navdrawer.pin) {
            // Close drawer when selecting a view on mobile (unpinned)
            this.navdrawer.close();
        }
    });
  }

  public openLogin() {
    this.dialog.open();
  }

  public login(provider: string) {
    this.authManager.login(provider);
  }

  public logout() {
    this.authManager.logout();
  }

  public toggleUserActions() {
    this._overlaySettings.positionStrategy.settings.target = this.userButton.nativeElement;
    this.toggle.toggle(this._overlaySettings);
  }
}
