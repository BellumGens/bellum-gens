import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesComponent } from './user-preferences.component';
import { FormsModule } from '@angular/forms';
import { IgxInputGroupModule, IgxSwitchModule, IgxIconModule, IgxDialogModule, IgxRippleModule } from 'igniteui-angular';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserPreferencesComponent', () => {
  let component: UserPreferencesComponent;
  let fixture: ComponentFixture<UserPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxInputGroupModule,
        IgxSwitchModule,
        IgxIconModule,
        IgxDialogModule,
        IgxRippleModule
      ],
      declarations: [ UserPreferencesComponent, ConfirmComponent ]
    })
    .compileComponents();
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
