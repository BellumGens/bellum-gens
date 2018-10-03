import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxDialogComponent, ConnectedPositioningStrategy, VerticalAlignment, HorizontalAlignment } from 'igniteui-angular';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;

  private _positionSettings = {
    horizontalStartPoint: HorizontalAlignment.Right,
    verticalStartPoint: VerticalAlignment.Bottom
  };
  public overlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(this._positionSettings)
  };

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
