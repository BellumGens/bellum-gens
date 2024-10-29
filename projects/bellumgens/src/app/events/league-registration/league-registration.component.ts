import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import {
  EMPTY_NEW_APPLICATION,
  ApplicationUser,
  LoginService,
  ApiTournamentsService,
  StartsWithPipe
} from '../../../../../common/src/public_api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IGX_DRAG_DROP_DIRECTIVES, IGX_DROP_DOWN_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IgxAutocompleteDirective, IgxButtonDirective, IgxCheckboxComponent, IgxDialogComponent, IgxDividerDirective, IgxIconComponent } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-league-registration',
  templateUrl: './league-registration.component.html',
  styleUrls: ['./league-registration.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    IgxAutocompleteDirective,
    IGX_DROP_DOWN_DIRECTIVES,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxDialogComponent,
    IgxCheckboxComponent,
    IgxButtonDirective,
    IgxDividerDirective,
    StartsWithPipe
  ]
})
export class LeagueRegistrationComponent {
  @Input()
  public tournamentId: string;

  @ViewChild('appDetails', { static: true })
  public appDetails: ElementRef;

  public application = Object.assign({}, EMPTY_NEW_APPLICATION);
  public authUser: ApplicationUser;
  public companies: string [];
  public inProgress = false;

  public chooseGame = $localize`Choose league (game)`;
  public loginFirst = $localize`Please login first`;

  constructor(private authManager: LoginService,
              private apiService: ApiTournamentsService,
              private router: Router) {
    this.authManager.applicationUser.subscribe(user => {
      if (user) {
        this.authUser = user;
        this.application.email = user.email;
        this.application.battleNetId = user.battleNetId;
      }
    });
    this.apiService.companies.subscribe(data => this.companies = data);
  }

  public leagueRegistration() {
    this.inProgress = true;
    this.application.tournamentId = this.tournamentId;
    this.apiService.leagueRegistration(this.application).subscribe({
      next: (application) => {
        this.inProgress = false;
        this.application = application;
        this.router.navigate(['/registration-success'], { state: application });
      },
      complete: () => this.inProgress = false
    });
  }

  public scrollToTerms(event: MouseEvent) {
    const element = document.getElementById('terms');
    element.scrollIntoView({ behavior: 'smooth' });
    event.stopPropagation();
  }
}
