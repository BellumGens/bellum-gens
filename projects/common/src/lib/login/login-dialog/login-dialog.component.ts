import { Component, ViewChild } from '@angular/core';
import { IgxDialogComponent, IgxDialogModule, IgxDividerModule, IgxInputGroupModule, IgxIconModule, IgxCheckboxModule, IgxButtonModule } from '@infragistics/igniteui-angular';
import { LoginService } from '../../../services/login.service';
import { UserLogin } from '../../../models/userlogin';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginButtonsComponent } from '../login-buttons/login-buttons.component';

@Component({
    selector: 'bg-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    standalone: true,
    imports: [IgxDialogModule, LoginButtonsComponent, IgxDividerModule, FormsModule, IgxInputGroupModule, IgxIconModule, IgxCheckboxModule, IgxButtonModule]
})
export class LoginDialogComponent {
  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  public logininfo: UserLogin = {
    username: '',
    password: '',
    rememberMe: false
  };
  public submitInProgress = false;

  constructor(private authManager: LoginService, private router: Router) {
  }

  public openLogin() {
    this.dialog.open();
  }

  public openRegistration() {
    this.dialog.close();
    this.router.navigate(['register']);
  }

  public loginWithForm() {
    this.submitInProgress = true;
    this.authManager.loginWithForm(this.logininfo).subscribe(() => {
      this.dialog.close();
      this.submitInProgress = false;
    });
  }
}
