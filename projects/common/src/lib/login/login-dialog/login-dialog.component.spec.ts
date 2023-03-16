import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  IgxDialogModule,
  IgxButtonModule,
  IgxIconModule,
  IgxDividerModule,
  IgxCheckboxModule,
  IgxInputGroupModule
} from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { LoginButtonsComponent } from '../login-buttons/login-buttons.component';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxDialogModule,
        IgxButtonModule,
        IgxIconModule,
        IgxDividerModule,
        IgxCheckboxModule,
        IgxInputGroupModule,
        LoginDialogComponent, LoginButtonsComponent
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
