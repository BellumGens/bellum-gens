import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { IgxToggleDirective, PositionSettings, HorizontalAlignment, OverlaySettings, ConnectedPositioningStrategy} from 'igniteui-angular';
import { LoginService } from './services/login.service';
import { ApplicationUser } from './models/applicationuser';
import { SuccessErrorComponent } from './success-error/success-error.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;
  public authUser: ApplicationUser;

  public positionSettings: PositionSettings = {
    horizontalDirection: HorizontalAlignment.Left,
    horizontalStartPoint: HorizontalAlignment.Right
  };

  public overlaySettings: OverlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy(this.positionSettings)
  };

  @ViewChild(IgxToggleDirective) public toggle: IgxToggleDirective;
  @ViewChild('userButton') public userButton: ElementRef;
  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private authManager: LoginService) {
  }

  public ngOnInit(): void {
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
  }
}
