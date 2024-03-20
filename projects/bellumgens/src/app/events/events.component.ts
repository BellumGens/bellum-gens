import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { IgxDividerDirective } from '@infragistics/igniteui-angular';
import { BaseDirective } from '../base/base.component';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [IgxDividerDirective, NgOptimizedImage],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseDirective {
  constructor(
    protected titleService: Title,
    protected meta: Meta,
    protected activeRoute: ActivatedRoute
  ) {
    super(titleService, meta, activeRoute);
  }
}
