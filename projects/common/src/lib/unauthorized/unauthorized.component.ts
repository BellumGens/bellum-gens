import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'bg-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  imports: [RouterLink, IgxButtonDirective, IgxRippleDirective, IgxIconComponent]
})
export class UnauthorizedComponent {
  private activatedRoute = inject(ActivatedRoute);
  private loginService = inject(LoginService);

  public message = signal<string>('Unauthorized :(');
  public authUser = this.loginService.applicationUser;

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      const message = params['message'];
      if (message) {
        this.message.set(message);
      }
    });
  }

  /** Opens the login dialog of the app's login component. */
  public login() {
    this.loginService.emitOpenLogin();
  }
}
