import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginButtonsComponent } from './login-buttons.component';

describe('LoginButtonsComponent', () => {
  let component: LoginButtonsComponent;
  let fixture: ComponentFixture<LoginButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginButtonsComponent ]
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
