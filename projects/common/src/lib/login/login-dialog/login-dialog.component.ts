import { Component, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IgxButtonDirective, IgxDividerComponent } from '@infragistics/igniteui-angular/directives';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
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
      IgxDividerComponent,
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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
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
      error: () => {
        this.submitInProgress = false;
      },
      complete: () => {
        this.submitInProgress = false;
      }
    });
  }
}
