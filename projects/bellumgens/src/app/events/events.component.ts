import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { IGX_CARD_DIRECTIVES, IgxAvatarComponent, IgxButtonDirective, IgxDividerDirective } from '@infragistics/igniteui-angular';
import { BaseDirective } from '../base/base.component';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountrySVGPipe } from '../../../../common/src/lib/pipes/country-svg.pipe';

@Component({
  selector: 'app-events',
  imports: [
    IgxDividerDirective,
    IGX_CARD_DIRECTIVES,
    IgxAvatarComponent,
    IgxButtonDirective,
    DatePipe,
    NgOptimizedImage,
    CountrySVGPipe,
    RouterLink
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseDirective {
  public invitedPlayers = [
    {name: 'Clement "Clem" Desplanches', country: 'France', race: 'Terran', team: 'Team Liquid', source: '🏆Champion BGE Stara Zagora 2024', image: '/assets/bge/players/2-clem.webp'},
    {name: 'Li "Oliveira" Peinan', country: 'China', race: 'Terran', team: 'DKZ Gaming', source: 'Runner-up BGE Stara Zagora 2024', image: '/assets/bge/players/5-oliveira.webp'},
    {name: 'Riccardo "Reynor" Romiti', country: 'Italy', race: 'Zerg', team: 'BASILISK', source: '3rd place BGE Stara Zagora 2024', image: '/assets/bge/players/8-reynor.webp'},
    {name: 'Tobias "ShoWTimE" Sieber', country: 'Germany', race: 'Protoss', team: 'BIG', source: '4th place BGE Stara Zagora 2024', image: '/assets/bge/players/4-showtime.webp'},
  ];

  public qualifiedPlayers = [
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Europe Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Europe Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Europe Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Europe Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Europe Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Americas Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Americas Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Balkan Open Qualifier', image: '/assets/bge/silhouette.webp'},
  ];

  public talent = [
    {name: 'Kevin "RotterdaM" van der Kooi', country: 'Netherlands', role: 'Commentator', image: '/assets/bge/talent/17-rotti.png'},
    {name: 'Philip "BeoMulf" Mulford', country: 'United-States-of-America', role: 'Commentator', image: '/assets/bge/talent/18-beomulf.png'},
    {name: 'Konstantin "NoThx" Kunev', country: 'Bulgaria', role: 'Commentator', image: '/assets/bge/talent/19-nothx.png'},
    {name: 'Lachezar "Exalted" Kamenov', country: 'Bulgaria', role: 'Commentator', image: '/assets/bge/talent/20-exalted.png'}
  ];

  public bgeBalkanId = '0313a19e-d527-46f9-bbea-08dd07ccaf69';

  // Timer for the event
  // public isoDate = '2024-11-02T15:00:00Z';
  // public announcementDate = new Date(this.isoDate);
  // public seconds = 0;
  // public minutes = 0;
  // public hours = 0;
  // public days = 0;
  // public sub: Subscription;

  // public ticketsUrl = 'https://www.eventim.bg/en/tickets/bellum-gens-elite-stara-zagora-stara-zagora-leten-teatr-642927/event.html';

  constructor(
    //@Inject(PLATFORM_ID) private platformId: any,
    protected titleService: Title,
    protected meta: Meta,
    protected activeRoute: ActivatedRoute
  ) {
    super(titleService, meta, activeRoute);
    // if (this.localeId === 'bg') {
    //   this.ticketsUrl = 'https://www.eventim.bg/bg/bileti/bellum-gens-elite-stara-zagora-stara-zagora-leten-teatr-642927/event.html';
    // }
    // if (isPlatformBrowser(this.platformId)) {
    //   this.sub = interval(1000).subscribe(() => this.timeLeft());
    // }
    // this.timeLeft();
  }

  // public timeLeft() {
  //   let delta = (this.announcementDate.getTime() - new Date().getTime()) / 1000;
  //   if (delta < 0) {
  //     delta = 0;
  //     this.sub?.unsubscribe();
  //   }
  //   this.days = Math.floor(delta / 86400);
  //   delta -= this.days * 86400;
  //   this.hours = Math.floor(delta / 3600) % 24;
  //   delta -= this.hours * 3600;
  //   this.minutes = Math.floor(delta / 60) % 60;
  //   delta -= this.minutes * 60;
  //   this.seconds = Math.floor(delta);
  // }

  // public ngOnDestroy() {
  //   this.sub?.unsubscribe();
  // }
}
