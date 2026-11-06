import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';

/** The terms of sale customers accept at checkout. */
@Component({
  selector: 'bg-shop-terms',
  imports: [RouterLink, IgxButtonDirective, IgxRippleDirective],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
}
