import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IGX_TABS_DIRECTIVES } from '@infragistics/igniteui-angular';
import { BaseDirective } from '../base/base.component';

@Component({
  selector: 'app-partners',
  imports: [
    IGX_TABS_DIRECTIVES,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersComponent extends BaseDirective {}
