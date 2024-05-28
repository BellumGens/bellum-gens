import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { IGX_CARD_DIRECTIVES, IgxAvatarComponent, IgxDividerDirective, IgxIconComponent } from '@infragistics/igniteui-angular';
import { BaseDirective } from '../base/base.component';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
    NgOptimizedImage,
    CountrySVGPipe,
    Sc2RaceThumbPipe,
    NgFor,
    NgIf
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseDirective {
  public players = [
    {name: 'Kang "Solar" Min Soo', country: 'South-Korea', race: 'Zerg', team: 'Team Vitality', image: '/assets/bge/players/2-solar.png'},
    {name: 'Clement "Clem" Desplanches', country: 'France', race: 'Terran', team: 'Team Liquid', image: '/assets/bge/players/1-clem.png'},
    {name: 'Diego "Kelazhur" Schwimer', country: 'Brazil', race: 'Terran', team: 'R8 Esports', image: '/assets/bge/players/3-kelazhur.png'},
    {name: 'Tobias "ShoWTimE" Sieber', country: 'Germany', race: 'Protoss', team: 'BIG', image: '/assets/bge/players/6-showtime.png'},
    {name: 'Li "Oliveira" Peinan', country: 'China', race: 'Terran', team: 'DKZ Gaming', image: '/assets/bge/players/5-oliveira.png'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', image: '/assets/bge/silhouette.webp'},
    {name: 'TBA', country: 'TBA', race: 'TBA', team: 'TBA', image: '/assets/bge/silhouette.webp'},
  ];

  constructor(
    protected titleService: Title,
    protected meta: Meta,
    protected activeRoute: ActivatedRoute
  ) {
    super(titleService, meta, activeRoute);
  }
}
