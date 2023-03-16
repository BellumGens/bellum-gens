import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPreferencesComponent } from './user-preferences.component';
import { FormsModule } from '@angular/forms';
import {
  IgxSwitchModule,
  IgxIconModule,
  IgxDialogModule,
  IgxRippleModule,
  IgxDividerModule,
  IgxButtonModule,
  IgxListModule
} from '@infragistics/igniteui-angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfirmComponent } from '../../confirm/confirm.component';

describe('UserPreferencesComponent', () => {
  let component: UserPreferencesComponent;
  let fixture: ComponentFixture<UserPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxSwitchModule,
        IgxIconModule,
        IgxDialogModule,
        IgxDividerModule,
        IgxButtonModule,
        IgxDividerModule,
        IgxRippleModule,
        IgxListModule,
        UserPreferencesComponent,
        ConfirmComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
