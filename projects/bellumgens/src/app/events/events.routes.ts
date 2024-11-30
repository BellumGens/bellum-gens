import { Routes } from "@angular/router";
import { EventsComponent } from "./events.component";
import { LeagueRegistrationComponent } from "./league-registration/league-registration.component";
import { BgeBalkanComponent } from "./bge-balkan/bge-balkan.component";

export const routes: Routes = [
  { path: '', component: EventsComponent, data: {
    title: 'Bellum Gens Elite Stara Zagora: The home of esports in Bulgaria',
    twitterTitle: 'Bellum Gens Elite Stara Zagora: The home of esports in Bulgaria',
    description: 'Bellum Gens Elite Stara Zagora is the home of esports in Bulgaria. We host the best gaming events in the country.',
    twitterDescription: 'Bellum Gens Elite Stara Zagora is the home of esports in Bulgaria. We host the best gaming events in the country.'
  } },
  { path: 'registration', component: LeagueRegistrationComponent },
  { path: 'registration/:tournamentId', component: LeagueRegistrationComponent },
  { path: 'bge-balkan-circuit', component: BgeBalkanComponent, data: {
    title: 'Bellum Gens Elite Weekly Balkan Circuit',
    twitterTitle: 'Bellum Gens Elite Weekly Balkan Circuit',
    description: 'Bellum Gens Elite Weekly Balkan Circuit is a weekly StarCraft II competition for players from the Balkan region. Participate to earn points towards monthly cash prizes!',
    twitterDescription: 'Bellum Gens Elite Weekly Balkan Circuit is a weekly StarCraft II competition for players from the Balkan region. Participate to earn points towards monthly cash prizes!'
  } },
];
