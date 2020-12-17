import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamApplication, CSGOTeam } from '../../../../src-common/models/csgoteam';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  @Input() public team: CSGOTeam;

  @Output() public loaded = new EventEmitter<TeamApplication []>();

  @Output() public changed = new EventEmitter<number>();

  public notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  public applications: TeamApplication [];
  public pipeTrigger = 0;
  public actionInProgress = false;
  public actionText = '';

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
    if (this.team) {
      this.apiService.teamApplications(this.team.teamId).subscribe(data => {
        this.applications = data;
        this.loaded.emit(data);
      });
    }
  }

  public approveApplication(application: TeamApplication) {
    this.actionText = 'Approving...';
    this.actionInProgress = true;
    this.apiService.approveApplication(application).subscribe(
      data => {
        application = data;
        this.pipeTrigger++;
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      _ => this.actionInProgress = false
    );
  }

  public rejectApplication(application: TeamApplication) {
    this.actionText = 'Rejecting...';
    this.actionInProgress = true;
    this.apiService.rejectApplication(application).subscribe(
      data => {
        application = data;
        this.pipeTrigger++;
        this.changed.emit(-1);
        this.actionInProgress = false;
      },
      _ => this.actionInProgress = false
    );
  }
}
