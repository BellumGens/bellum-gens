import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IgxListComponent } from 'igniteui-angular';
import { TeamApplication, CSGOTeam } from 'src/app/models/csgoteam';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  notificationClass = ['', '', 'notification-disabled', 'notification-disabled'];
  applications: TeamApplication [];

  @Input()
  team: CSGOTeam;

  @ViewChild(IgxListComponent) public notifications: IgxListComponent;

  constructor(private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    this.apiService.teamApplications(this.team.TeamId).subscribe(data => {
      this.applications = data;
    });
  }

  public approveApplication(application: TeamApplication) {
    this.apiService.approveApplication(application).subscribe(data => application = data);
  }

  public rejectApplication(application: TeamApplication) {
    this.apiService.rejectApplication(application).subscribe(data => application = data);
  }
}
