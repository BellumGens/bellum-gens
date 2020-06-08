import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';
import { IgxDialogModule } from '@infragistics/igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        IgxDialogModule
      ],
      declarations: [ ConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
