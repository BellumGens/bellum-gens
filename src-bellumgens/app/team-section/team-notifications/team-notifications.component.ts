import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { TeamApplication, CSGOTeam } from '../../../../src-common/models/csgoteam';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  applications: TeamApplication [];
  public pipeTrigger = 0;
  public actionInProgress = false;
  public actionText = '';

  @Input()
  team: CSGOTeam;

  @Output()
  loaded = new EventEmitter<TeamApplication []>();

  @Output()
  changed = new EventEmitter<number>();

  @ViewChild(IgxListComponent, { static: false }) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
    if (this.team) {
      this.apiService.teamApplications(this.team.TeamId).subscribe(data => {
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
