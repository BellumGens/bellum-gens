import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategiesComponent } from './strategies.component';
import { StrategyDetailsComponent } from './strategy-details/strategy-details.component';
import { StrategyEditorComponent } from './strategy-editor/strategy-editor.component';

const routes: Routes = [
  { path: '', component: StrategiesComponent },
  { path: 'public', component: StrategiesComponent },
  { path: 'user', component: StrategiesComponent },
  { path: ':query', component: StrategiesComponent, data: { title: 'CS:GO Strategies: find or create' } },
  { path: 'edit/:stratid', component: StrategyEditorComponent },
  { path: 'details/:stratid', component: StrategyDetailsComponent, data: { title: 'Bellum Gens CS:GO Strategy' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategiesRoutingModule { }
