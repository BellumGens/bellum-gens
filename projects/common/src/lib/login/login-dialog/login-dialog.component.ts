import { Component, ViewChild, inject } from '@angular/core';
import {
  IgxDialogComponent,
  IgxDividerDirective,
  IGX_INPUT_GROUP_DIRECTIVES,
  IgxIconComponent,
  IgxCheckboxComponent,
  IgxButtonDirective
} from '@infragistics/igniteui-angular';
import { LoginService } from '../../../services/login.service';
import { UserLogin } from '../../../models/userlogin';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginButtonsComponent } from '../login-buttons/login-buttons.component';

@Component({
    selector: 'bg-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    imports: [
      IgxDialogComponent,
      LoginButtonsComponent,
      IgxDividerDirective,
      FormsModule,
      IGX_INPUT_GROUP_DIRECTIVES,
      IgxIconComponent,
      IgxCheckboxComponent,
      IgxButtonDirective
    ]
})
export class LoginDialogComponent {
  private authManager = inject(LoginService);
  private router = inject(Router);

  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  public logininfo: UserLogin = {
    username: '',
    password: '',
    rememberMe: false
  };
  public submitInProgress = false;

  public openLogin() {
    this.dialog.open();
  }

  public openRegistration() {
    this.dialog.close();
    this.router.navigate(['register']);
  }

  public loginWithForm() {
    this.submitInProgress = true;
    this.authManager.loginWithForm(this.logininfo).subscribe({
      next: () => {
        this.dialog.close();
      },
      complete: () => {
        this.submitInProgress = false;
      }
    });
  }
}
