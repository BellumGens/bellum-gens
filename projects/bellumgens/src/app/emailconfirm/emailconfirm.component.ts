import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './emailconfirm.component.html',
    styleUrls: ['./emailconfirm.component.css'],
    standalone: true
})
export class EmailconfirmComponent {
  private route = inject(ActivatedRoute);

  public message = 'Email confirmed successfully!';

  constructor() {
    this.route.params.subscribe(params => {
      if (params['error'] === 'error') {
        this.message = ':( Error confirming your email address!';
      } else if (params['error'] === 'unsubscribed') {
        this.message = 'You\'ve been unsubscribed successfully!';
      }
    });
  }

}
