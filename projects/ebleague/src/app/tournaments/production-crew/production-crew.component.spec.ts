import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductionCrewComponent } from './production-crew.component';
import { IgxCardModule, IgxIconModule, IgxButtonModule } from '@infragistics/igniteui-angular';

describe('ProductionCrewComponent', () => {
  let component: ProductionCrewComponent;
  let fixture: ComponentFixture<ProductionCrewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        IgxCardModule,
        IgxIconModule,
        IgxButtonModule,
        ProductionCrewComponent
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
