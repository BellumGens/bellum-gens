import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tournament, TournamentStatus, TournamentVisibility, Game } from '../../../models/tournament';
import { IgxCardComponent, IgxCardHeaderComponent, IgxCardContentDirective, IgxCardActionsComponent, IgxCardMediaDirective, IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective } from '@infragistics/igniteui-angular/card';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';

@Component({
  selector: 'bg-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrl: './tournament-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink,
    IgxCardComponent,
    IgxCardHeaderComponent,
    IgxCardContentDirective,
    IgxCardActionsComponent,
    IgxCardMediaDirective,
    IgxCardHeaderTitleDirective,
    IgxCardHeaderSubtitleDirective,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxChipComponent
  ]
})
export class TournamentCardComponent {
  tournament = input.required<Tournament>();
  detailRoutePrefix = input<string>('/tournaments');
  showManage = input(false);

  manage = output<Tournament>();
  deleteTournament = output<Tournament>();

  TournamentStatus = TournamentStatus;
  TournamentVisibility = TournamentVisibility;
  Game = Game;

  get statusBadgeType(): string {
    const t = this.tournament();
    switch (t.status) {
      case TournamentStatus.Open: return 'success';
      case TournamentStatus.InProgress: return 'warning';
      case TournamentStatus.Completed: return 'info';
      case TournamentStatus.Cancelled: return 'error';
      default: return 'default';
    }
  }

  get statusLabel(): string {
    const t = this.tournament();
    switch (t.status) {
      case TournamentStatus.Draft: return 'Draft';
      case TournamentStatus.Open: return 'Open';
      case TournamentStatus.InProgress: return 'In Progress';
      case TournamentStatus.Completed: return 'Completed';
      case TournamentStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  get visibilityIcon(): string {
    const t = this.tournament();
    switch (t.visibility) {
      case TournamentVisibility.Public: return 'public';
      case TournamentVisibility.Private: return 'lock';
      case TournamentVisibility.InviteOnly: return 'mail';
      default: return 'public';
    }
  }

  get gameLabel(): string {
    const t = this.tournament();
    switch (t.game) {
      case Game.CSGO: return 'Counter-Strike';
      case Game.StarCraft2: return 'StarCraft II';
      default: return '';
    }
  }
}
