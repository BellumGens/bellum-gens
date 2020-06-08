import { Component, HostListener, ViewChild } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { SocialMediaService } from '../../../src-common/services/social-media.service';
import { CommunicationService } from '../../../src-common/services/communication.service';
import { environment } from '../../../src-common/environments/environment';
import { BaseComponent } from '../base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IgxCarouselComponent } from '@infragistics/igniteui-angular';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public navigation = true;
  public environment = environment;
  public userEmail: string = null;

  @ViewChild(IgxCarouselComponent, { static: true })
  public carousel: IgxCarouselComponent;

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private socialMedia: SocialMediaService,
              private commService: CommunicationService,
              titleService: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(titleService, meta, activeRoute);
    this.navigation = window.matchMedia('(min-width: 768px)').matches;
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }

  public tweet() {
    this.socialMedia.tweetWithText('Hey @BellumGens...');
  }

  public openTeams() {
    this.commService.emitOpenTeams();
  }

  @HostListener('window:resize')
  public resize() {
    this.navigation = window.matchMedia('(min-width: 768px)').matches;
  }

  public navigateToEbleague() {
    window.location.href = this.environment.ebleague;
  }

}
