import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { IgxProgressBarModule } from 'igniteui-angular';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

const routes: Routes = [
  { path: '', redirectTo: '/app-shell', pathMatch: 'full' }
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
  declarations: [],
})
export class AppServerModule {
  constructor() {
  }
}
