import { Component } from '@angular/core';
import { ApiTournamentsService } from '../../../../../src-common/services/bellumgens-api.tournaments.service';
import { TournamentCSGOMatch } from '../../../../../src-common/models/tournament-schedule';
import { DateRangeDescriptor, DateRangeType, GridSelectionMode } from '@infragistics/igniteui-angular';
import { SameDay } from '../../../../../src-common/models/misc';
import { environment } from '../../../../../src-common/environments/environment';

@Component({
  selector: 'app-csgo-tournament-schedule',
  templateUrl: './tournament-schedule.component.html',
  styleUrls: ['./tournament-schedule.component.scss']
})
export class CSGOTournamentScheduleComponent {
  public csgomatches: TournamentCSGOMatch [];
  public datesWithMatches: DateRangeDescriptor[] = [];
  public selectedMatches: TournamentCSGOMatch [] = [];
  public today: Date | Date [] = new Date();
  public loading = false;
  public environment = environment;
  public selectionMode = GridSelectionMode.none;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.loadingCSGOMatches.subscribe(data => this.loading = data);
    this.apiService.csgoMatches.subscribe(data => {
      if (data) {
        this.csgomatches = data;
        this.selectedMatches = this.csgomatches.filter(m => SameDay(new Date(m.StartTime), this.today as Date));
        data.forEach(match => {
          this.datesWithMatches.push({ type: DateRangeType.Specific, dateRange: [ new Date(match.StartTime) ] });
        });
      }
    });
  }

  public daySelected(date: Date | Date []) {
    this.today = date;
    this.selectedMatches = this.csgomatches.filter(m => SameDay(new Date(m.StartTime), this.today as Date));
  }
}
