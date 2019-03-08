import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IgxAvatarModule, IgxIconModule, IgxToggleModule, IgxDropDownModule, IgxDialogModule, IgxRippleModule } from 'igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxIconModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxDialogModule,
        IgxRippleModule
      ],
      declarations: [ LoginComponent ]
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
