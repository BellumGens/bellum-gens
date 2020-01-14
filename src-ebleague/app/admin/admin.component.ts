import { Component } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from '../../../src-common/models/applicationuser';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';
import { Tournament } from '../../../src-common/models/tournament';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public roles: string [];
  public users: ApplicationUser [];
  public tournaments: Tournament [];

  constructor(private authService: LoginService,
              private apiService: ApiTournamentsService) {
    this.authService.getUserRoles().subscribe(data => this.roles = data);
    this.authService.getUsers().subscribe(data => this.users = data);
    this.apiService.tournaments.subscribe(data => this.tournaments = data);
  }

  public submitRole(role: string) {
    this.authService.submitRole(role).subscribe(_ => {
      this.authService.getUserRoles().subscribe(roles => this.roles = roles);
    });
  }

  public addAdmin(userId: string) {
    this.authService.addUserToRole(userId, 'admin').subscribe(_ => this.authService.getUsers().subscribe(data => this.users = data));
  }

  public addEventAdmin(userId: string) {
    this.authService.addUserToRole(userId, 'event-admin').subscribe(_ => this.authService.getUsers().subscribe(data => this.users = data));
  }
}
