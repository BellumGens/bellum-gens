import { Component, OnInit, Input } from '@angular/core';
import { Availability } from '../../models/playeravailability';
import { BellumgensApiService } from '../../services/bellumgens-api.service';

@Component({
  selector: 'app-team-calendar',
  templateUrl: './team-calendar.component.html',
  styleUrls: ['./team-calendar.component.css']
})
export class TeamCalendarComponent implements OnInit {
  @Input()
  public practiceSchedule: Availability[];

  @Input()
  public isAdmin = false;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public changeSchedule(day: Availability) {
    this.apiService.setTeamPractice(day).subscribe();
  }

}
