import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { IgxProgressBarModule } from 'igniteui-angular';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    IgxProgressBarModule
  ],
  bootstrap: [AppComponent],
  declarations: [],
})
export class AppServerModule {
  constructor() {
  }
}
