import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Availability } from 'src/app/models/playeravailability';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';

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

  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public changeSchedule(day: Availability) {
    this.apiService.setTeamPractice(day).subscribe(
      success => this.toast.showSuccess('Practice schedule updated successfully!'),
      error => this.toast.showError(error.error.Message)
    );
  }

}
