import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessErrorComponent } from './success-error.component';
import { IgxSnackbarModule, IgxIconModule } from 'igniteui-angular';

describe('SuccessErrorComponent', () => {
  let component: SuccessErrorComponent;
  let fixture: ComponentFixture<SuccessErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IgxIconModule,
        IgxSnackbarModule
      ],
      declarations: [ SuccessErrorComponent ]
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
