import { Component, OnInit, Input } from '@angular/core';
import { Availability } from 'src/app/models/playeravailability';

@Component({
  selector: 'app-team-calendar',
  templateUrl: './team-calendar.component.html',
  styleUrls: ['./team-calendar.component.css']
})
export class TeamCalendarComponent implements OnInit {
  @Input()
  public practiceSchedule: Availability[];

  constructor() { }

  ngOnInit() {
  }

}
