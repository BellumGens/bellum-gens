import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { IgxProgressBarModule } from 'igniteui-angular';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

const routes: Routes = [
  { path: 'home', component: AppShellComponent }
];

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    IgxProgressBarModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent],
  declarations: [AppShellComponent],
})
export class AppServerModule {
  constructor(private router: Router) {
    this.router.resetConfig(routes);
  }
}
