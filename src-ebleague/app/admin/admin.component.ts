import { Component } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { ApiTournamentsService } from '../../../src-common/services/bellumgens-api.tournaments.service';
import { Tournament, EMPTY_NEW_TOURNAMENT, TournamentApplication } from '../../../src-common/models/tournament';
import { JerseyOrder, Promo } from '../../../src-common/models/jerseyorder';
import { ApiShopService } from '../../../src-common/services/bellumgens-api.shop.service';
import { IGridEditEventArgs, GridSelectionMode, DataType } from '@infragistics/igniteui-angular';
import { noop } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public roles: string [];
  // public users: AdminAppUserSummary [];
  public tournaments: Tournament [];
  public tournament = Object.assign({}, EMPTY_NEW_TOURNAMENT);
  public orders: JerseyOrder [];
  public registrations: TournamentApplication [];
  public promos: Promo [];
  public selectionMode = GridSelectionMode;
  public gridDataType = DataType;

  constructor(private authService: LoginService,
              private apiService: ApiTournamentsService,
              private shopService: ApiShopService) {
    this.authService.getUserRoles().subscribe(data => this.roles = data);
    // this.authService.getUsers().subscribe(data => this.users = data);
    this.authService.getPromoCodes().subscribe(data => this.promos = data);
    this.apiService.tournaments.subscribe(data => {
      if (data) {
        data.forEach(t => {
          t.startDate = new Date(t.startDate);
          t.endDate = new Date(t.endDate);
        });
        this.tournaments = data;
      }
    });
    this.shopService.getOrders().subscribe(data => this.orders = data);
    this.apiService.allRegistrations.subscribe(data => this.registrations = data);
  }

  public submitRole(role: string) {
    this.authService.submitRole(role).subscribe(() => this.authService.getUserRoles().subscribe(roles => this.roles = roles));
  }

  public updateTournament(tournament?: Tournament) {
    this.apiService.createTournament(tournament || this.tournament).subscribe(data => !tournament ? this.tournaments.push(data) : noop());
  }

  public editDone(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    rowData[event.column.field] = event.newValue;
    this.shopService.confirmOrder(rowData).subscribe();
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    rowData[event.column.field] = event.newValue ? 1 : 0;
    this.apiService.confirmRegistration(rowData).subscribe();
  }
}
