import { Component } from '@angular/core';
import { ApiTournamentsService } from '../../../../../src-common/services/bellumgens-api.tournaments.service';
import { TournamentCSGOMatch } from 'src-common/models/tournament-schedule';
import { DateRangeDescriptor, DateRangeType } from 'igniteui-angular';
import { SameDay } from '../../../../../src-common/models/misc';

@Component({
  selector: 'app-csgo-tournament-schedule',
  templateUrl: './tournament-schedule.component.html',
  styleUrls: ['./tournament-schedule.component.scss']
})
export class CSGOTournamentScheduleComponent {
  public csgomatches: TournamentCSGOMatch [];
  public datesWithMatches: DateRangeDescriptor[] = [];
  public selectedMatches: TournamentCSGOMatch [] = [];
  public today = new Date();

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.getCSGOMatches().subscribe(data => {
      this.csgomatches = data;
      this.selectedMatches = this.csgomatches.filter(m => SameDay(new Date(m.StartTime), this.today));
      data.forEach(match => {
        this.datesWithMatches.push({ type: DateRangeType.Specific, dateRange: [ new Date(match.StartTime) ] });
      });
    });
  }

  public daySelected(date: Date) {
    this.today = date;
    this.selectedMatches = this.csgomatches.filter(m => SameDay(new Date(m.StartTime), this.today));
  }
}
