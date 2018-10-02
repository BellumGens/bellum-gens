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
import { ApplicationUser } from './models/applicationuser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;

  @ViewChild(IgxNavigationDrawerComponent) public navdrawer: IgxNavigationDrawerComponent;
  @ViewChild(IgxToggleDirective) public toggle: IgxToggleDirective;
  @ViewChild('userButton') public userButton: ElementRef;

  constructor(private router: Router) {
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
}
