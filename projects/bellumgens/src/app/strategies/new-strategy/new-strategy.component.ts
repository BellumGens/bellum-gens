import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import {
  CSGOStrategy,
  NEW_EMPTY_STRAT,
  CSGOTeam,
  ApplicationUser,
  CSGOActiveDutyMap,
  ACTIVE_DUTY,
  ApiStrategiesService
} from '../../../../../common/src/public_api';
import { IGX_DIALOG_DIRECTIVES, IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_RADIO_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/radio';
import { IgxSwitchComponent } from '@infragistics/igniteui-angular/switch';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IsVideoPipe } from '../../pipes/is-video.pipe';
import { Router } from '@angular/router';
import { SafeVideoLinkPipe } from '../../pipes/safe-video-link.pipe';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-strategy',
  templateUrl: './new-strategy.component.html',
  styleUrls: ['./new-strategy.component.scss'],
  imports: [
    IGX_DIALOG_DIRECTIVES,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxIconComponent,
    IGX_RADIO_GROUP_DIRECTIVES,
    IgxSwitchComponent,
    IGX_SELECT_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    IsVideoPipe,
    SafeVideoLinkPipe
  ]
})
export class NewStrategyComponent {
  private apiService = inject(ApiStrategiesService);
  private router = inject(Router);

  public dialog = viewChild.required<IgxDialogComponent>('newStrat');

  public team = input<CSGOTeam>();

  public authUser = input<ApplicationUser>();

  public strategyAdded = output<CSGOStrategy>();

  public newStrategy = signal<CSGOStrategy>(Object.assign({}, NEW_EMPTY_STRAT));
  public mapList: CSGOActiveDutyMap [] = ACTIVE_DUTY;
  public selectedMap = this.mapList[0];
  public title = signal('Add a new team strategy');

  private _defaultTitle = 'Add a new team strategy';

  public open(strat?: CSGOStrategy, title?: string) {
    if (strat) {
      this.newStrategy.set(strat);
    } else if (!this.team()) {
      this.newStrategy.update(current => ({ ...current, visible: true }));
    }

    this.title.set(title || this._defaultTitle);
    this.dialog().open();
  }

  public resetStrategy() {
    this.newStrategy.set({ ...NEW_EMPTY_STRAT, visible: !this.team() });
  }

  public submitStrategy() {
    const strategy = this.strategyToSubmit();
    // A new strategy carries the empty guid from NEW_EMPTY_STRAT until the server assigns its id.
    const isNew = !strategy.id || strategy.id === NEW_EMPTY_STRAT.id;
    this.apiService.submitStrategy(strategy).subscribe({
      next: strat => {
        if (isNew) {
          this.strategyAdded.emit(strat);
        }
        this.dialog().close();
      },
      // The service already reports the error; keep the dialog open so the user can retry.
      error: () => {}
    });
  }

  public createAndRedirect() {
    this.apiService.submitStrategy(this.strategyToSubmit()).subscribe({
      next: strat => this.router.navigate(['strategies', 'edit', strat.customUrl]),
      error: () => {}
    });
  }

  // The form edits the strategy fields in place (when editing, that is the listed strategy itself),
  // so the url is normalized the same way.
  public urlChanged(url: string) {
    let link = url;
    if (IsVideoPipe.isYoutube(url)) {
      link = IsVideoPipe.getYoutubeEmbedLink(url);
    } else if (IsVideoPipe.isTwitch(url)) {
      link = IsVideoPipe.getTwitchEmbedLink(url);
    }
    this.newStrategy().url = link;
  }

  private strategyToSubmit(): CSGOStrategy {
    const team = this.team();
    const strategy = this.newStrategy();
    return team ? { ...strategy, teamId: team.teamId } : strategy;
  }
}
