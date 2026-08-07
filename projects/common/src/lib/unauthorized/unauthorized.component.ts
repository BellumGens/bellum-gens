import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'bg-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  standalone: true
})
export class UnauthorizedComponent {
  private activatedRoute = inject(ActivatedRoute);

  public message = signal<string>('Unauthorized :(');

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      const message = params['message'];
      if (message) {
        this.message.set(message);
      }
    });
  }

}
