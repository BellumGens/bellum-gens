import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament, TournamentStatus } from '../../../models/tournament';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { LoginService } from '../../../services/login.service';
import { TournamentCardComponent } from '../tournament-card/tournament-card.component';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular/tabs';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxDialogComponent, IgxDialogActionsDirective } from '@infragistics/igniteui-angular/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bg-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrl: './tournament-list.component.scss',
  imports: [
    FormsModule,
    TournamentCardComponent,
    IGX_TABS_DIRECTIVES,
    IgxIconComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxCircularProgressBarComponent,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxDialogComponent,
    IgxDialogActionsDirective
  ]
})
export class TournamentListComponent {
  private apiService = inject(ApiTournamentsService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  private publicTournaments = this.apiService.publicTournaments;
  private ownTournaments = this.apiService.myTournaments;

  public tournaments = computed<Tournament[]>(() => this.publicTournaments() ?? []);
  public myTournaments = computed<Tournament[]>(() => this.ownTournaments() ?? []);
  public loading = computed(() => !this.publicTournaments());
  public activeTab = signal(0);
  public inviteCode = '';

  private authUser = this.loginService.applicationUser;
  public isLoggedIn = computed(() => !!this.authUser());

  public activeTournaments = computed(() =>
    this.tournaments().filter(t => t.status === TournamentStatus.Open || t.status === TournamentStatus.InProgress)
  );

  public upcomingTournaments = computed(() =>
    this.tournaments().filter(t => t.status === TournamentStatus.Draft && t.startDate && new Date(t.startDate).getTime() > Date.now())
  );

  public completedTournaments = computed(() =>
    this.tournaments().filter(t => t.status === TournamentStatus.Completed)
  );

  public createTournament() {
    this.router.navigate(['/tournaments/create']);
  }

  public manageTournament(tournament: Tournament) {
    this.router.navigate(['/tournaments/manage', tournament.id]);
  }

  public onDeleteTournament(tournament: Tournament) {
    this.apiService.deleteTournament(tournament.id).subscribe();
  }

  public joinByInvite(dialog: IgxDialogComponent) {
    if (this.inviteCode?.trim()) {
      this.apiService.joinByInviteCode(this.inviteCode.trim()).subscribe({
        next: () => {
          dialog.close();
          this.inviteCode = '';
        }
      });
    }
  }
}
