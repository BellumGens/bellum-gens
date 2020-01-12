import { Component } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { ApplicationUser } from 'src-common/models/applicationuser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public roles: string [];
  public users: ApplicationUser [];

  constructor(private authService: LoginService) {
    this.authService.getUserRoles().subscribe(data => this.roles = data);
    this.authService.getUsers().subscribe(data => this.users = data);
  }

  public submitRole(role: string) {
    this.authService.submitRole(role).subscribe(_ => {
      this.authService.getUserRoles().subscribe(roles => this.roles = roles);
    });
  }

  public addAdmin(userId: string) {
    this.authService.addUserToRole(userId, 'admin').subscribe(_ => this.authService.getUsers().subscribe(data => this.users = data));
  }
}
