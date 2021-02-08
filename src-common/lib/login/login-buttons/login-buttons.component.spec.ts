import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginButtonsComponent } from './login-buttons.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxButtonModule, IgxIconModule, IgxDividerModule } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginButtonsComponent', () => {
  let component: LoginButtonsComponent;
  let fixture: ComponentFixture<LoginButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginButtonsComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxButtonModule,
        IgxIconModule,
        IgxDividerModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
