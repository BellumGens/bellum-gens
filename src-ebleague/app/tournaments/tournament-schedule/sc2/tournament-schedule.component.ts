import { Component } from '@angular/core';
import { ApiTournamentsService } from '../../../../../src-common/services/bellumgens-api.tournaments.service';
import { TournamentSC2Match } from '../../../../../src-common/models/tournament-schedule';
import { DateRangeDescriptor, DateRangeType } from 'igniteui-angular';
import { SameDay } from '../../../../../src-common/models/misc';

@Component({
  selector: 'app-sc2-tournament-schedule',
  templateUrl: './tournament-schedule.component.html',
  styleUrls: ['./tournament-schedule.component.scss']
})
export class SC2TournamentScheduleComponent {
  public sc2matches: TournamentSC2Match [];
  public datesWithMatches: DateRangeDescriptor[] = [];
  public selectedMatches: TournamentSC2Match [] = [];
  public today = new Date();
  public loading = false;

  constructor(private apiService: ApiTournamentsService) {
    this.apiService.loadingSC2Matches.subscribe(data => this.loading = data);
    this.apiService.sc2Matches.subscribe(data => {
      if (data) {
        this.sc2matches = data;
        this.selectedMatches = this.sc2matches.filter(m => SameDay(new Date(m.StartTime), this.today));
        data.forEach(match => {
          this.datesWithMatches.push({ type: DateRangeType.Specific, dateRange: [ new Date(match.StartTime) ] });
        });
      }
    });
  }

  public daySelected(date: Date) {
    this.today = date;
    this.selectedMatches = this.sc2matches.filter(m => SameDay(new Date(m.StartTime), this.today));
  }
}
