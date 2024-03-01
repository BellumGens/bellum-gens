import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bg-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  standalone: true
})
export class UnauthorizedComponent {
  public message = 'Unauthorized :(';

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const message = params['message'];
      if (message) {
        this.message = message;
      }
    });
  }

}
