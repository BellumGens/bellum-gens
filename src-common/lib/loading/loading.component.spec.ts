import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppShellComponent } from './app-shell.component';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IgxProgressBarModule
      ],
      declarations: [ AppShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
