import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import {
  EMPTY_NEW_GROUP,
  Tournament,
  TournamentGroup,
  TournamentParticipant,
  ApiTournamentsService,
  TournamentCSGOMatch, TournamentMatchMap,
  CSGOActiveDutyMap, ACTIVE_DUTY
} from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';
import { IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES, IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IRowDataEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { IGX_GRID_DIRECTIVES, IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IGX_DIALOG_DIRECTIVES, IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IGX_DATE_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/date-picker';
import { IGX_TIME_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/time-picker';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { NotInGroupPipe } from '../../pipes/not-in-group.pipe';
import { CSGOMapnamePipe } from '../../../../../common/src/lib/pipes/csgomapname.pipe';
import { CSGOMapimagePipe } from '../../../../../common/src/lib/pipes/csgomapimage.pipe';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-csgo',
  templateUrl: './admin-csgo.component.html',
  styleUrls: ['./admin-csgo.component.scss'],
  imports: [
    IGX_SELECT_DIRECTIVES,
    FormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_GRID_DIRECTIVES,
    IgxButtonDirective,
    IgxIconComponent,
    IgxAvatarComponent,
    IGX_LIST_DIRECTIVES,
    IGX_CARD_DIRECTIVES,
    IgxCircularProgressBarComponent,
    IGX_DRAG_DROP_DIRECTIVES,
    IgxBadgeComponent,
    IGX_DIALOG_DIRECTIVES,
    IGX_DATE_PICKER_DIRECTIVES,
    IGX_TIME_PICKER_DIRECTIVES,
    IgxCheckboxComponent,
    ConfirmComponent,
    DatePipe,
    CSGOMapimagePipe,
    CSGOMapnamePipe,
    NotInGroupPipe
  ]
})
export class AdminCsgoComponent {
  private apiService = inject(ApiTournamentsService);
  private cdr = inject(ChangeDetectorRef);

  public tournaments = this.apiService.tournaments;
  public selectedTournament = signal<Tournament>(null);
  private tournamentId = computed(() => this.selectedTournament()?.id);
  public registrations = computed<TournamentParticipant []>(() =>
    this.tournamentId() ? this.apiService.getCsgoRegistrations(this.tournamentId())() : null);
  public groups = computed<TournamentGroup []>(() =>
    this.tournamentId() ? this.apiService.getCsgoGroups(this.tournamentId())() : null);
  public matches = computed<TournamentCSGOMatch []>(() =>
    this.tournamentId() ? this.apiService.getCsgoMatches(this.tournamentId())() : null);
  public loading = this.apiService.loadingCSGORegistrations;
  public loadingMatches = this.apiService.loadingCSGOMatches;
  public environment = environment;
  public newGroup = Object.assign({}, EMPTY_NEW_GROUP);
  public pipeTrigger = signal(0);
  public mapList: CSGOActiveDutyMap [] = ACTIVE_DUTY;
  public matchInEdit: TournamentCSGOMatch = { startTime: new Date() };

  public selectTournament(tournament: Tournament) {
    this.selectedTournament.set(tournament);
  }

  // The service adds new groups to (and removes deleted ones from) its per-tournament cache
  public submitGroup(group: TournamentGroup) {
    group.inEdit = false;
    this.apiService.submitCSGOGroup(group, this.tournamentId()).subscribe();
  }

  public deleteGroup(id: string) {
    this.apiService.deleteGroup(id).subscribe();
    this.pipeTrigger.update(trigger => trigger + 1);
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    this.apiService.addParticipantToGroup(event.dragData, group.id).subscribe();
    group.participants = [ ...(group.participants || []), event.dragData ];
    event.dragData.tournamentCSGOGroupId = group.id;
    this.pipeTrigger.update(trigger => trigger + 1);
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    this.apiService.removeParticipantFromGroup(participant.id, group.id).subscribe({
      next: () => {
        group.participants = group.participants?.filter(p => p !== participant);
        participant.tournamentCSGOGroupId = null;
        this.pipeTrigger.update(trigger => trigger + 1);
      }
    });
  }

  public submitMatch(grid: IgxGridComponent) {
    if (this.matchInEdit.team1Id && this.matchInEdit.team2Id) {
      this.apiService.submitCSGOMatch(this.matchInEdit).subscribe(data => {
        if (data) {
          if (!this.matchInEdit.id) {
            data.startTime = new Date(data.startTime);
            grid.addRow(data);
          }
        }
      });
    }
  }

  public deleteMatch(event: IRowDataEventArgs) {
    const match = event.data;
    this.apiService.deleteCSGOMatch(match).subscribe();
  }

  public addNewMatch() {
    this.matchInEdit = { startTime: new Date() };
  }

  public editMatch(match: TournamentCSGOMatch, dialog: IgxDialogComponent) {
    if (!(match.startTime instanceof Date)) {
      match.startTime = new Date(match.startTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    this.apiService.deleteCSGOMatchMap(map.id).subscribe(() => {
      // The maps array belongs to the grid row being edited, so it's updated in place
      maps.splice(maps.indexOf(map), 1);
      this.cdr.markForCheck();
    });
  }
}
