import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './emailconfirm.component.html',
  styleUrls: ['./emailconfirm.component.css']
})
export class EmailconfirmComponent {
  private route = inject(ActivatedRoute);

  public message = toSignal(
    this.route.params.pipe(map(params => {
      if (params['error'] === 'error') {
        return ':( Error confirming your email address!';
      } else if (params['error'] === 'unsubscribed') {
        return 'You\'ve been unsubscribed successfully!';
      }
      return 'Email confirmed successfully!';
    })),
    { initialValue: 'Email confirmed successfully!' }
  );
}
