import { Routes } from "@angular/router";
import { EventsComponent } from "./events.component";
import { LeagueRegistrationComponent } from "./league-registration/league-registration.component";

export const routes: Routes = [
  { path: '', component: EventsComponent, data: {
    title: 'Bellum Gens Elite Stara Zagora: The home of esports in Bulgaria',
    twitterTitle: 'Bellum Gens Elite Stara Zagora: The home of esports in Bulgaria',
    description: 'Bellum Gens Elite Stara Zagora is the home of esports in Bulgaria. We host the best gaming events in the country.',
    twitterDescription: 'Bellum Gens Elite Stara Zagora is the home of esports in Bulgaria. We host the best gaming events in the country.'
  } },
  { path: 'registration', component: LeagueRegistrationComponent },
  { path: 'registration/:tournamentId', component: LeagueRegistrationComponent }
];
