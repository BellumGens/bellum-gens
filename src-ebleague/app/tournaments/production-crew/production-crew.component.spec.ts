import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductionCrewComponent } from './production-crew.component';
import { IgxCardModule, IgxIconModule, IgxButtonModule } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductionCrewComponent', () => {
  let component: ProductionCrewComponent;
  let fixture: ComponentFixture<ProductionCrewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionCrewComponent ],
      imports: [
        IgxCardModule,
        IgxIconModule,
        IgxButtonModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionCrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
