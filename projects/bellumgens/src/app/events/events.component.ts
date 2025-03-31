import { DatePipe, DecimalPipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, Inject, LOCALE_ID, PLATFORM_ID, OnDestroy } from '@angular/core';
import { IGX_CARD_DIRECTIVES, IgxAvatarComponent, IgxButtonDirective, IgxDividerDirective } from '@infragistics/igniteui-angular';
import { BaseDirective } from '../base/base.component';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountrySVGPipe } from '../../../../common/src/lib/pipes/country-svg.pipe';
import { interval, Subscription } from 'rxjs';

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
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseDirective implements OnDestroy {
  public invitedPlayers = [
    {name: 'Clement "Clem" Desplanches', country: 'France', race: 'Terran', team: 'Team Liquid', source: '🏆Champion BGE Stara Zagora 2024', image: '/assets/bge/players/2-clem.webp'},
    {name: 'Joona "Serral" Sotala', country: 'Finland', race: 'Zerg', team: 'BASILISK', source: 'Replaces Li "Oliveira" Peinan', image: '/assets/bge/players/1-serral.webp'},
    // {name: 'Li "Oliveira" Peinan', country: 'China', race: 'Terran', team: 'DKZ Gaming', source: 'Runner-up BGE Stara Zagora 2024', image: '/assets/bge/players/5-oliveira.webp'},
    {name: 'Riccardo "Reynor" Romiti', country: 'Italy', race: 'Zerg', team: 'BASILISK', source: '3rd place BGE Stara Zagora 2024', image: '/assets/bge/players/3-reynor.webp'},
    {name: 'Tobias "ShoWTimE" Sieber', country: 'Germany', race: 'Protoss', team: 'BIG', source: '4th place BGE Stara Zagora 2024', image: '/assets/bge/players/4-showtime.webp'},
  ];

  public qualifiedPlayers = [
    {name: 'Yoon "trigger" Hong', country: 'Canada', race: 'Protoss', team: 'BASILISK', source: 'Americas Open Qualifier', image: '/assets/bge/players/6-trigger.png'},
    {name: 'Joseph "Future" Stanish', country: 'United States of America', race: 'Terran', team: 'Matcherino', source: 'Americas Open Qualifier', image: '/assets/bge/players/5-future.png'},
    {name: 'Cho "Maru" Seong-ju', country: 'South Korea', race: 'Terran', team: 'Team Vitality', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'Kim "Ryung" Dong-won', country: 'South Korea', race: 'Terran', team: 'Team Vitality', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'Park "Zoun" Han-sol', country: 'South Korea', race: 'Protoss', team: '', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'Lei "Rex" Hao-chen', country: 'Taiwan', race: 'Zerg', team: 'OFFSYDE Esports', source: 'Asia Open Qualifier', image: '/assets/bge/silhouette.webp'},
    {name: 'Nikita "SKillous" Gurevich', country: 'Russia', race: 'Protoss', team: 'Team Liquid', source: 'Europe Open Qualifier', image: '/assets/bge/players/11-skillous.png'},
    {name: 'Yakov "YoungYakov" Moiseenko', country: 'Russia', race: 'Zerg', team: '', source: 'Europe Open Qualifier', image: '/assets/bge/players/23-youngyakov.png'},
    {name: 'Piotr "Spirit" Walukiewicz', country: 'Poland', race: 'Terran', team: '', source: 'Europe Open Qualifier', image: '/assets/bge/players/10-spirit.png'},
    {name: 'Kevin "Harstem" Koning', country: 'Netherlands', race: 'Protoss', team: 'Shopify Rebellion', source: 'Europe Open Qualifier', image: '/assets/bge/players/7-harstem.png'},
    {name: 'Julian "Lambo" Brosig', country: 'Germany', race: 'Zerg', team: 'Shopify Rebellion', source: 'Europe Open Qualifier', image: '/assets/bge/players/8-lambo.png'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', source: 'Balkan Open Qualifier', image: '/assets/bge/silhouette.webp'},
  ];

  // public talent = [
  //   {name: 'Kevin "RotterdaM" van der Kooi', country: 'Netherlands', role: 'Commentator', image: '/assets/bge/talent/17-rotti.png'},
  //   {name: 'Philip "BeoMulf" Mulford', country: 'United-States-of-America', role: 'Commentator', image: '/assets/bge/talent/18-beomulf.png'},
  //   {name: 'Konstantin "NoThx" Kunev', country: 'Bulgaria', role: 'Commentator', image: '/assets/bge/talent/19-nothx.png'},
  //   {name: 'Lachezar "Exalted" Kamenov', country: 'Bulgaria', role: 'Commentator', image: '/assets/bge/talent/20-exalted.png'}
  // ];

  public bgeBalkanId = '0313a19e-d527-46f9-bbea-08dd07ccaf69';
  public americasQualifierId = '1fe0af1f-7dfc-4476-db4d-08dd4cd5c5da';
  public asiaQualifierId = '0232380e-c3d1-4c49-db4e-08dd4cd5c5da';
  public europeQualifierId = '9f2f02af-c09b-4d97-db4f-08dd4cd5c5da';
  public balkanQualifierId = '5670bc9c-26e4-44d8-db50-08dd4cd5c5da';

  // Timer for the event
  public isoDate = '2025-04-05T13:00:00Z';
  public announcementDate = new Date(this.isoDate);
  public seconds = 0;
  public minutes = 0;
  public hours = 0;
  public days = 0;
  public sub: Subscription;

  public ticketsUrl = 'https://www.eventim.bg/en/tickets/bellum-gens-elite-stara-zagora-2025-stara-zagora-leten-teatr-662711/event.html';

  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    @Inject(PLATFORM_ID) private platformId: any,
    protected titleService: Title,
    protected meta: Meta,
    protected activeRoute: ActivatedRoute
  ) {
    super(titleService, meta, activeRoute);
    if (this.localeId === 'bg') {
      this.ticketsUrl = 'https://www.eventim.bg/bg/bileti/bellum-gens-elite-stara-zagora-2025-stara-zagora-leten-teatr-662711/event.html';
    }
    if (isPlatformBrowser(this.platformId)) {
      this.sub = interval(1000).subscribe(() => this.timeLeft());
    }
    this.timeLeft();
  }

  public timeLeft() {
    let delta = (this.announcementDate.getTime() - new Date().getTime()) / 1000;
    if (delta < 0) {
      delta = 0;
      this.sub?.unsubscribe();
    }
    this.days = Math.floor(delta / 86400);
    delta -= this.days * 86400;
    this.hours = Math.floor(delta / 3600) % 24;
    delta -= this.hours * 3600;
    this.minutes = Math.floor(delta / 60) % 60;
    delta -= this.minutes * 60;
    this.seconds = Math.floor(delta);
  }

  public scrollTo(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  public ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
