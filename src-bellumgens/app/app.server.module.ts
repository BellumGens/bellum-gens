import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { IgxProgressBarModule } from 'igniteui-angular';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    IgxProgressBarModule
  ],
  bootstrap: [AppComponent],
  declarations: [],
})
export class AppServerModule {
  constructor() {
  }
}
