import { Component, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LoginService,
  ApiTournamentsService,
  Tournament, EMPTY_NEW_TOURNAMENT,
  Promo,
  ApiShopService
} from '../../../../../common/src/public_api';
import { IGridEditEventArgs, RowType } from '@infragistics/igniteui-angular/grids/core';
import { DefaultSortingStrategy, IGroupingExpression, SortingDirection } from '@infragistics/igniteui-angular/core';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IGX_ACTION_STRIP_DIRECTIVES } from '@infragistics/igniteui-angular/action-strip';
import { IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_PAGINATOR_DIRECTIVES } from '@infragistics/igniteui-angular/paginator';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_DATE_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/date-picker';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IGX_CHIPS_DIRECTIVES } from '@infragistics/igniteui-angular/chips';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { FormsModule } from '@angular/forms';
import { SizeNamePipe } from '../../pipes/size-name.pipe';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
  imports: [
    FormsModule,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    IgxBadgeComponent,
    IGX_ACTION_STRIP_DIRECTIVES,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IGX_PAGINATOR_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_DATE_PICKER_DIRECTIVES,
    IGX_CARD_DIRECTIVES,
    IgxCheckboxComponent,
    IGX_CHIPS_DIRECTIVES,
    SizeNamePipe,
    NgOptimizedImage
  ]
})
export class AdminMainComponent {
  private authService = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private shopService = inject(ApiShopService);

  public roles = signal<string []>(null);
  // public users: AdminAppUserSummary [];
  private allTournaments = this.apiService.tournaments;
  // A local copy with parsed dates for the grid's date editors; tournaments created here are appended to it
  public tournaments = linkedSignal<Tournament []>(() => this.allTournaments()?.map(t => ({
    ...t,
    startDate: new Date(t.startDate),
    endDate: new Date(t.endDate)
  })) ?? null);
  public tournament = Object.assign({}, EMPTY_NEW_TOURNAMENT);
  public orders = toSignal(this.shopService.getOrders());
  public registrations = this.apiService.allRegistrations;
  public promos = signal<Promo []>(null);
  public grouping: IGroupingExpression [] = [
    { dir: SortingDirection.Desc, fieldName: 'tournamentName', ignoreCase: false, strategy: DefaultSortingStrategy.instance() },
    { dir: SortingDirection.Asc, fieldName: 'game', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
  ];

  constructor() {
    this.authService.getUserRoles().subscribe(data => this.roles.set(data));
    // this.authService.getUsers().subscribe(data => this.users = data);
    this.authService.getPromoCodes().subscribe(data => this.promos.set(data));
  }

  public submitRole(role: string) {
    this.authService.submitRole(role).subscribe(() => this.authService.getUserRoles().subscribe(roles => this.roles.set(roles)));
  }

  public updateTournament(tournament?: Tournament) {
    this.apiService.createTournament(tournament || this.tournament).subscribe(data => {
      if (!tournament) {
        this.tournaments.update(tournaments => [...(tournaments || []), data]);
      }
    });
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

  public deleteRegistration(rowContext: RowType) {
    rowContext.grid.transactions.commit(rowContext.grid.data, rowContext.key);
    this.apiService.deleteRegistration(rowContext.key).subscribe();
  }

  public deleteOrder(rowContext: RowType) {
    rowContext.grid.transactions.commit(rowContext.grid.data, rowContext.key);
    this.shopService.deleteOrder(rowContext.key).subscribe();
  }
}
