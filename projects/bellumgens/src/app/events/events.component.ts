import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { IGX_CARD_DIRECTIVES, IgxAvatarComponent, IgxButtonDirective, IgxDividerDirective, IgxIconComponent } from '@infragistics/igniteui-angular';
import { BaseDirective } from '../base/base.component';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountrySVGPipe } from '../../../../common/src/lib/pipes/country-svg.pipe';
import { Sc2RaceThumbPipe } from '../../../../common/src/lib/pipes/sc2-race-thumb.pipe';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    IgxDividerDirective,
    IGX_CARD_DIRECTIVES,
    IgxAvatarComponent,
    IgxIconComponent,
    IgxButtonDirective,
    DatePipe,
    NgOptimizedImage,
    CountrySVGPipe,
    Sc2RaceThumbPipe,
    RouterLink
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseDirective {
  public invitedPlayers = [
    {name: 'Kang "Solar" Min Soo', country: 'South-Korea', race: 'Zerg', team: 'Team Vitality', image: '/assets/bge/players/1-solar.png'},
    {name: 'Clement "Clem" Desplanches', country: 'France', race: 'Terran', team: 'Team Liquid', image: '/assets/bge/players/2-clem.png'},
    {name: 'Diego "Kelazhur" Schwimer', country: 'Brazil', race: 'Terran', team: 'R8 Esports', image: '/assets/bge/players/3-kelazhur.png'},
    {name: 'Tobias "ShoWTimE" Sieber', country: 'Germany', race: 'Protoss', team: 'BIG', image: '/assets/bge/players/4-showtime.png'},
    {name: 'Li "Oliveira" Peinan', country: 'China', race: 'Terran', team: 'DKZ Gaming', image: '/assets/bge/players/5-oliveira.png'},
    {name: 'Peycho "Nitix" Ivanov', country: 'Bulgaria', race: 'Zerg', team: 'BSL', source: 'Replaces Piotr "Spirit" Walukiewicz', image: '/assets/bge/players/6-nitix.png'},
    {name: 'Kim "Stats" Dae-yeob', country: 'South-Korea', race: 'Protoss', team: 'Twisted Minds', image: '/assets/bge/players/7-stats.png'},
    {name: 'Riccardo "Reynor" Romiti', country: 'Italy', race: 'Zerg', team: 'BASILISK', image: '/assets/bge/players/8-reynor.png'},
  ];

  public qualifiedPlayers = [
    {name: 'Nikita "SKillous" Gurevich', country: '', race: 'Protoss', team: 'Team Liquid', source: 'Global Open Qualifier', image: '/assets/bge/players/9-skillous.png'},
    {name: 'Martin "Fjant" Koffman', country: 'Sweden', race: 'Zerg', team: 'Team Rotti', source: 'Replaces Huang "Lancer" Min', image: '/assets/bge/players/10-fjant.png'},
    {name: 'Yoon "trigger" Hong', country: 'Canada', race: 'Protoss', team: 'BASILISK', source: 'Global Open Qualifier', image: '/assets/bge/players/11-trigger.png'},
    {name: 'Adrien "DnS" Bouet', country: 'France', race: 'Protoss', team: 'Berserker eSports', source: 'Global Open Qualifier', image: '/assets/bge/players/12-dns.png'},
    {name: 'Mateusz "Gerald" Budziak', country: 'Poland', race: 'Protoss', source: 'Replaces Maxwell "Astrea" Angel', team: 'PSISTORM Gaming', image: '/assets/bge/players/13-gerald.png'},
    {name: 'Julian "Lambo" Brosig', country: 'Germany', race: 'Zerg', team: 'Shopify Rebellion', source: 'Global Open Qualifier', image: '/assets/bge/players/14-lambo.png'},
    {name: 'Kevin "Harstem" Koning', country: 'Netherlands', race: 'Protoss', team: 'Shopify Rebellion', source: 'Global Open Qualifier', image: '/assets/bge/players/15-harstem.png'},
    {name: 'Mihail "msrm" Mihaylov', country: 'Bulgaria', race: 'Zerg', team: 'BSL', source: 'Bulgarian Open Qualifier', image: '/assets/bge/players/16-msrm.png'}
  ];

  public talent = [
    {name: 'Kevin "RotterdaM" van der Kooi', country: 'Netherlands', role: 'Commentator', image: '/assets/bge/talent/17-rotti.png'},
    {name: 'Philip "BeoMulf" Mulford', country: 'United-States-of-America', role: 'Commentator', image: '/assets/bge/talent/18-beomulf.png'},
    {name: 'Konstantin "NoThx" Kunev', country: 'Bulgaria', role: 'Commentator', image: '/assets/bge/talent/19-nothx.png'},
    {name: 'Lachezar "Exalted" Kamenov', country: 'Bulgaria', role: 'Commentator', image: '/assets/bge/talent/20-exalted.png'}
  ]

  // public ticketsUrl = 'https://www.eventim.bg/en/tickets/bellum-gens-elite-stara-zagora-stara-zagora-leten-teatr-642927/event.html';

  constructor(
    protected titleService: Title,
    protected meta: Meta,
    protected activeRoute: ActivatedRoute
  ) {
    super(titleService, meta, activeRoute);
    // if (this.localeId === 'bg') {
    //   this.ticketsUrl = 'https://www.eventim.bg/bg/bileti/bellum-gens-elite-stara-zagora-stara-zagora-leten-teatr-642927/event.html';
    // }
  }
}
