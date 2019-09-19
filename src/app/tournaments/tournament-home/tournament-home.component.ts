import { Component, HostListener } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { Title, Meta } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss']
})
export class TournamentHomeComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public userEmail: string = null;
  public headerTitle = 'Esports Business League';
  public headerTitleShort = 'EBL';

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private commService: CommunicationService,
              private title: Title,
              private meta: Meta) {
    super();
    this.title.setTitle('Esports Business League: Sign-up');
    this.meta.updateTag({ name: 'description', content: 'Esports competition in business | Esports бизнес лига записване'});
    this.commService.title = window.matchMedia('(min-width: 768px)').matches ? this.headerTitle : this.headerTitleShort;
    this.subs.push(
      this.authManager.applicationUser.subscribe(user => this.authUser = user)
    );
  }

  public subscribe() {
    if (this.userEmail) {
      this.apiService.addSubscriber(this.userEmail).subscribe();
    }
  }

  @HostListener('window:resize')
  public resize() {
    this.commService.title = window.matchMedia('(min-width: 768px)').matches ? this.headerTitle : this.headerTitleShort;
  }
}
