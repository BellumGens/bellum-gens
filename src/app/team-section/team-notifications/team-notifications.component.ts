import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { TeamApplication, CSGOTeam } from '../../models/csgoteam';
import { BellumgensApiService } from '../../services/bellumgens-api.service';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  applications: TeamApplication [];
  public pipeTrigger = 0;

  @Input()
  team: CSGOTeam;

  @Output()
  loaded = new EventEmitter<TeamApplication []>();

  @Output()
  changed = new EventEmitter<number>();

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    if (this.team) {
      this.apiService.teamApplications(this.team.TeamId).subscribe(data => {
        this.applications = data;
        this.loaded.emit(data);
      });
    }
  }

  public approveApplication(application: TeamApplication, event: Event) {
    const button = (<HTMLButtonElement>event.target);
    button.textContent = 'Approving';
    this.apiService.approveApplication(application).subscribe(data => {
      application = data;
      this.pipeTrigger++;
      this.changed.emit(-1);
    },
    _ => {
      button.textContent = 'Approve';
      button.disabled = false;
    });
  }

  public rejectApplication(application: TeamApplication, event: Event) {
    const button = (<HTMLButtonElement>event.target);
    button.textContent = 'Rejecting';
    this.apiService.rejectApplication(application).subscribe(data => {
      application = data;
      this.pipeTrigger++;
      this.changed.emit(-1);
    },
    _ => {
      button.textContent = 'Reject';
    });
  }
}
