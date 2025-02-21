import { Routes } from '@angular/router';
import { StrategiesComponent } from './strategies.component';
import { StrategyDetailsComponent } from './strategy-details/strategy-details.component';
import { StrategyEditorComponent } from './strategy-editor/strategy-editor.component';

export const routes: Routes = [
  { path: '', component: StrategiesComponent },
  { path: 'public', component: StrategiesComponent },
  { path: 'user', component: StrategiesComponent },
  { path: ':query', component: StrategiesComponent, data: { title: 'Bellum Gens Counter-Strike Strategies: find or create' } },
  { path: 'edit/:stratid', component: StrategyEditorComponent },
  { path: 'details/:stratid', component: StrategyDetailsComponent, data: { title: 'Bellum Gens Counter-Strike Strategy' } },
];
