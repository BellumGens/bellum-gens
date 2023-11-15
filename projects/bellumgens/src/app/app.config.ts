import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../../../common/src/environments/environment";
import { provideClientHydration } from "@angular/platform-browser";

export const appConfig: ApplicationConfig = {
  providers: [
      importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })),
      provideRouter(routes),
      provideHttpClient(withInterceptorsFromDi()),
      provideClientHydration(),
      provideAnimations()
  ]
};
