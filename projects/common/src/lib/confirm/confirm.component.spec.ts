import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';
import { IgxDialogModule } from '@infragistics/igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        IgxDialogModule,
        ConfirmComponent
    ]
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
