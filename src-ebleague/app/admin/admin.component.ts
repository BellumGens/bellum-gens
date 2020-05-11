import { Component } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { AdminAppUserSummary } from '../../../src-common/models/applicationuser';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';
import { Tournament, getEmptyNewTournament } from '../../../src-common/models/tournament';
import { JerseyOrder } from '../../../src-common/models/jerseyorder';
import { ApiShopService } from '../../../src-common/services/bellumgens-api.shop.service';
import { IGridEditEventArgs, IgxGridComponent } from 'igniteui-angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public roles: string [];
  public users: AdminAppUserSummary [];
  public tournaments: Tournament [];
  public tournament = getEmptyNewTournament();
  public orders: JerseyOrder [];

  constructor(private authService: LoginService,
              private apiService: ApiTournamentsService,
              private shopService: ApiShopService) {
    this.authService.getUserRoles().subscribe(data => this.roles = data);
    this.authService.getUsers().subscribe(data => this.users = data);
    this.apiService.tournaments.subscribe(data => this.tournaments = data);
    this.shopService.getOrders().subscribe(data => this.orders = data);
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

  public createTournament() {
    this.apiService.createTournament(this.tournament).subscribe(data => this.tournaments.push(data));
  }

  public addAllApplications(id: string) {
    this.apiService.addTournamentApplications(id).subscribe();
  }

  public editDone(event: IGridEditEventArgs, grid: IgxGridComponent) {
    const rowData = grid.getRowByKey(event.rowID).rowData;
    const column = grid.columnList.find(e => e.index === event.cellID.columnID);
    event.cancel = true;
    rowData[column.field] = event.newValue;
    this.shopService.confirmOrder(rowData).subscribe();
  }
}
