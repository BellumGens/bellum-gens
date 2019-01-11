import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { IgxToggleDirective} from 'igniteui-angular';
import { LoginService } from './services/login.service';
import { ApplicationUser } from './models/applicationuser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;
  public authUser: ApplicationUser;

  @ViewChild(IgxToggleDirective) public toggle: IgxToggleDirective;
  @ViewChild('userButton') public userButton: ElementRef;

  constructor(private authManager: LoginService) {
  }

  public ngOnInit(): void {
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
  }
}
