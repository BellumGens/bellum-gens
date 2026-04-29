import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  Tournament,
  TournamentVisibility,
  TournamentStatus,
  Game,
  GAMES
} from '../../../models/tournament';
import { ApiTournamentsService } from '../../../services/bellumgens-api.tournaments.service';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxSelectComponent, IgxSelectItemComponent } from '@infragistics/igniteui-angular/select';
import { IgxDatePickerComponent } from '@infragistics/igniteui-angular/date-picker';

@Component({
  selector: 'bg-tournament-create',
  templateUrl: './tournament-create.component.html',
  styleUrl: './tournament-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxSelectComponent,
    IgxSelectItemComponent,
    IgxDatePickerComponent
  ]
})
export class TournamentCreateComponent {
  private apiService = inject(ApiTournamentsService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  public saving = signal(false);
  public isEditMode = signal(false);
  public tournamentId = signal<string | null>(null);

  public games = GAMES;
  public visibilityOptions = [
    { value: TournamentVisibility.Public, label: 'Public', icon: 'public' },
    { value: TournamentVisibility.Private, label: 'Private', icon: 'lock' },
    { value: TournamentVisibility.InviteOnly, label: 'Invite Only', icon: 'mail' }
  ];

  public form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    game: new FormControl<Game | null>(null),
    visibility: new FormControl<TournamentVisibility>(TournamentVisibility.Public),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    maxParticipants: new FormControl<number | null>(null, [Validators.min(2)]),
    prizePool: new FormControl('')
  });

  constructor() {
    this.activeRoute.params.subscribe(params => {
      if (params['tournamentId']) {
        this.isEditMode.set(true);
        this.tournamentId.set(params['tournamentId']);
        this.apiService.getTournament(params['tournamentId']).subscribe(t => {
          if (t) {
            this.form.patchValue({
              name: t.name,
              description: t.description || '',
              game: t.game ?? null,
              visibility: t.visibility || TournamentVisibility.Public,
              startDate: t.startDate ? new Date(t.startDate) : null,
              endDate: t.endDate ? new Date(t.endDate) : null,
              maxParticipants: t.maxParticipants ?? null,
              prizePool: t.prizePool || ''
            });
          }
        });
      }
    });
  }

  public submit() {
    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.value;

    const tournament: Tournament = {
      name: value.name,
      description: value.description || undefined,
      game: value.game ?? undefined,
      visibility: value.visibility,
      startDate: value.startDate || undefined,
      endDate: value.endDate || undefined,
      maxParticipants: value.maxParticipants || undefined,
      prizePool: value.prizePool || undefined,
      status: TournamentStatus.Draft
    };

    if (this.isEditMode()) {
      tournament.id = this.tournamentId();
      this.apiService.updateTournament(tournament).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/tournaments']);
        },
        error: () => this.saving.set(false)
      });
    } else {
      this.apiService.createTournament(tournament).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/tournaments']);
        },
        error: () => this.saving.set(false)
      });
    }
  }

  public cancel() {
    this.router.navigate(['/tournaments']);
  }
}
