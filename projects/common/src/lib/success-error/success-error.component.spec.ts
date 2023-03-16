import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuccessErrorComponent } from './success-error.component';
import { IgxSnackbarModule, IgxIconModule } from '@infragistics/igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SuccessErrorComponent', () => {
  let component: SuccessErrorComponent;
  let fixture: ComponentFixture<SuccessErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        IgxIconModule,
        IgxSnackbarModule,
        SuccessErrorComponent
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
