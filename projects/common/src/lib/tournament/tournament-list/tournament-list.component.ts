import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public tournaments = signal<Tournament[]>([]);
  public myTournaments = signal<Tournament[]>([]);
  public loading = signal(true);
  public activeTab = signal(0);
  public inviteCode = '';

  public isLoggedIn = computed(() => !!this.loginService.applicationUser?.value);

  public activeTournaments = computed(() =>
    this.tournaments().filter(t => t.status === TournamentStatus.Open || t.status === TournamentStatus.InProgress)
  );

  public upcomingTournaments = computed(() =>
    this.tournaments().filter(t => t.status === TournamentStatus.Draft && t.startDate && new Date(t.startDate).getTime() > Date.now())
  );

  public completedTournaments = computed(() =>
    this.tournaments().filter(t => t.status === TournamentStatus.Completed)
  );

  constructor() {
    this.apiService.publicTournaments.subscribe(data => {
      if (data) {
        this.tournaments.set(data);
        this.loading.set(false);
      }
    });

    this.apiService.myTournaments.subscribe(data => {
      if (data) {
        this.myTournaments.set(data);
      }
    });
  }

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
