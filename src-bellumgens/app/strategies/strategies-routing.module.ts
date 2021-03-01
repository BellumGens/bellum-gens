import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategiesComponent } from './strategies.component';
import { StrategyEditorComponent } from './strategy-editor/strategy-editor.component';
import { UserStrategiesComponent } from './user-strategies/user-strategies.component';

const routes: Routes = [
  { path: '', component: StrategiesComponent },
  { path: 'user', component: UserStrategiesComponent },
  { path: ':query', component: StrategiesComponent, data: {
      title: 'CS:GO Strategies: find or create'
    }
  },
  { path: 'edit/:teamid/:stratid', component: StrategyEditorComponent },
  { path: 'details/:stratid', component: StrategyEditorComponent, data: {
      title: 'Bellum Gens CS:GO Strategy'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategiesRoutingModule { }
