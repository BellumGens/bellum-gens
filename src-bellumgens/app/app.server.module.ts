import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ServerTransferStateModule } from '@angular/platform-server';
import { XhrFactory } from '@angular/common/http';

import * as xhr2 from 'xhr2';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: XhrFactory, useClass: ServerXhr }],
  declarations: [],
})
export class AppServerModule {
  constructor() {
  }
}
