import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminCsgoComponent } from './admin-csgo/admin-csgo.component';
import { AdminGuard } from '../../../src-common/guards/admin.guard';
import { EventAdminGuard } from '../../../src-common/guards/eventadmin.guard';
import { AdminSc2Component } from './admin-sc2/admin-sc2.component';
import { AdminMainComponent } from './admin-main/admin-main.component';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: '', component: AdminMainComponent, canActivate: [ AdminGuard ] },
    { path: 'csgo', component: AdminCsgoComponent, canActivate: [ EventAdminGuard ] },
    { path: 'sc2', component: AdminSc2Component, canActivate: [ EventAdminGuard ] }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
