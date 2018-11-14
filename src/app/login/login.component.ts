import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxDialogComponent, PositionSettings, HorizontalAlignment, OverlaySettings, ConnectedPositioningStrategy } from 'igniteui-angular';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public authUser: ApplicationUser;

  public positionSettings: PositionSettings = {
    horizontalDirection: HorizontalAlignment.Left,
    horizontalStartPoint: HorizontalAlignment.Right
  };

  public overlaySettings: OverlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy(this.positionSettings)
  };

  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;

  constructor(private authManager: LoginService) { }

  ngOnInit() {
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
  }

  public openLogin() {
    this.dialog.open();
  }

  public login(provider: string) {
    this.authManager.login(provider);
  }

  public logout() {
    this.authManager.logout();
    this.authUser = null;
  }

}
