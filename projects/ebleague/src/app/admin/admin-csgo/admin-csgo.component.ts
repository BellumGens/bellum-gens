import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import {
  EMPTY_NEW_GROUP,
  Tournament,
  TournamentGroup,
  TournamentParticipant,
  TournamentCSGOMatch,
  TournamentMatchMap,
  CSGOActiveDutyMap,
  ACTIVE_DUTY
} from 'bellum-gens-common/models';
import { ApiTournamentsService } from 'bellum-gens-common/services';
import { environment } from 'bellum-gens-common/environments';
import { CSGOMapnamePipe, CSGOMapimagePipe } from 'bellum-gens-common/pipes';
import { ConfirmComponent } from 'bellum-gens-common';
import { IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES, IgxButtonDirective, IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
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
    IgxIconButtonDirective,
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
  public selectedTournament = signal<Tournament | null>(null);
  private tournamentId = computed(() => this.selectedTournament()?.id);
  public registrations = computed<TournamentParticipant [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getCsgoRegistrations(id)() : null;
  });
  public groups = computed<TournamentGroup [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getCsgoGroups(id)() : null;
  });
  public matches = computed<TournamentCSGOMatch [] | null>(() => {
    const id = this.tournamentId();
    return id ? this.apiService.getCsgoMatches(id)() : null;
  });
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
    this.apiService.submitCSGOGroup(group, this.tournamentId()).subscribe(() => {
      if (group === this.newGroup) {
        // The New group card starts over once its group is created
        this.newGroup = Object.assign({}, EMPTY_NEW_GROUP);
      }
    });
  }

  public deleteGroup(id: string) {
    this.apiService.deleteGroup(id).subscribe(() => {
      // The members of the deleted group are unassigned again
      this.registrations()?.filter(r => r.tournamentCSGOGroupId === id).forEach(r => r.tournamentCSGOGroupId = null);
      this.pipeTrigger.update(trigger => trigger + 1);
    });
  }

  public addToGroup(event: IDropDroppedEventArgs, group: TournamentGroup) {
    const groupId = group.id;
    if (!groupId) {
      return;
    }
    this.apiService.addParticipantToGroup(event.dragData, groupId).subscribe();
    group.participants = [ ...(group.participants || []), event.dragData ];
    event.dragData.tournamentCSGOGroupId = groupId;
    this.pipeTrigger.update(trigger => trigger + 1);
  }

  public removeFromGroup(participant: TournamentParticipant, group: TournamentGroup) {
    if (!group.id) {
      return;
    }
    this.apiService.removeParticipantFromGroup(participant.id, group.id).subscribe({
      next: () => {
        group.participants = group.participants?.filter(p => p !== participant);
        participant.tournamentCSGOGroupId = null;
        // The groups may list their own copies of the participants, so the unassigned participant is cleared as well
        const listed = this.registrations()?.find(r => r.id === participant.id);
        if (listed) {
          listed.tournamentCSGOGroupId = null;
        }
        this.pipeTrigger.update(trigger => trigger + 1);
      }
    });
  }

  public submitMatch(grid: IgxGridComponent) {
    if (this.matchInEdit.team1Id && this.matchInEdit.team2Id) {
      this.apiService.submitCSGOMatch(this.matchInEdit).subscribe(data => {
        if (data) {
          if (!this.matchInEdit.id) {
            if (data.startTime) {
              data.startTime = new Date(data.startTime);
            }
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
    // The API sends the start time as an ISO string
    const startTime: Date | string | undefined = match.startTime;
    if (startTime && !(startTime instanceof Date)) {
      match.startTime = new Date(startTime);
    }
    this.matchInEdit = match;
    dialog.open();
  }

  public deleteMatchMap(map: TournamentMatchMap, maps: TournamentMatchMap []) {
    if (!map.id) {
      return;
    }
    this.apiService.deleteCSGOMatchMap(map.id).subscribe(() => {
      // The maps array belongs to the grid row being edited, so it's updated in place
      maps.splice(maps.indexOf(map), 1);
      this.cdr.markForCheck();
    });
  }
}
