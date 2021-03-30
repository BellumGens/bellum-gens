import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IgxAvatarModule,
  IgxIconModule,
  IgxToggleModule,
  IgxDropDownModule,
  IgxDialogModule,
  IgxRippleModule,
  IgxTabsModule,
  IgxInputGroupModule,
  IgxSwitchModule,
  IgxProgressBarModule,
  IgxDividerModule,
  IgxButtonModule,
  IgxListModule} from '@infragistics/igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { LoginButtonsComponent } from './login-buttons/login-buttons.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxIconModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxDialogModule,
        IgxRippleModule,
        IgxTabsModule,
        IgxInputGroupModule,
        IgxSwitchModule,
        IgxDividerModule,
        IgxButtonModule,
        IgxProgressBarModule,
        IgxListModule
      ],
      declarations: [
        LoginComponent,
        LoginDialogComponent,
        LoginButtonsComponent,
        UserPreferencesComponent,
        ConfirmComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
