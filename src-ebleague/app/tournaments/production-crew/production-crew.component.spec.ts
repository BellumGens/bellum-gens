import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCrewComponent } from './production-crew.component';
import { IgxCardModule } from 'igniteui-angular';

describe('ProductionCrewComponent', () => {
  let component: ProductionCrewComponent;
  let fixture: ComponentFixture<ProductionCrewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionCrewComponent ],
      imports: [
        IgxCardModule
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
