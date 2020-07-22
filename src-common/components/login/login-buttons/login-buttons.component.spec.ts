import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginButtonsComponent } from './login-buttons.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxButtonModule, IgxIconModule, IgxDividerModule } from '@infragistics/igniteui-angular';

describe('LoginButtonsComponent', () => {
  let component: LoginButtonsComponent;
  let fixture: ComponentFixture<LoginButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginButtonsComponent ],
      imports: [
        HttpClientTestingModule,
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
