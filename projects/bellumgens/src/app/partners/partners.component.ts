import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [
    IGX_TABS_DIRECTIVES,
    RouterOutlet,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnersComponent { }
