import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../../../common/src/environments/environment";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";

export const appConfig: ApplicationConfig = {
  providers: [
      importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })),
      provideRouter(
        routes,
        withInMemoryScrolling({
          scrollPositionRestoration: 'enabled',
          anchorScrolling: 'enabled'
        }),
        withEnabledBlockingInitialNavigation()
      ),
      provideHttpClient(withInterceptorsFromDi(), withFetch()),
      provideClientHydration(withEventReplay()),
      provideAnimations()
  ]
};
