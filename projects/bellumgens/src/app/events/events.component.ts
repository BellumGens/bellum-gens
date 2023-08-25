import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { IgxDividerDirective } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [IgxDividerDirective, NgOptimizedImage],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

}
