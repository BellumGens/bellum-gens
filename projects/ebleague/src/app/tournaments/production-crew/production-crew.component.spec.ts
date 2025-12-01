import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductionCrewComponent } from './production-crew.component';
import { IGX_CARD_DIRECTIVES, IgxIconComponent, IgxButtonDirective } from '@infragistics/igniteui-angular';

describe('ProductionCrewComponent', () => {
  let component: ProductionCrewComponent;
  let fixture: ComponentFixture<ProductionCrewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        IGX_CARD_DIRECTIVES,
        IgxIconComponent,
        IgxButtonDirective,
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
