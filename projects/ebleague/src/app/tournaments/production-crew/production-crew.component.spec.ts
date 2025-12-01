import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductionCrewComponent } from './production-crew.component';

describe('ProductionCrewComponent', () => {
  let component: ProductionCrewComponent;
  let fixture: ComponentFixture<ProductionCrewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
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

  it('should initialize crewMembers', () => {
    expect(component.crewMembers).toBeDefined();
    expect(component.crewMembers.length).toBeGreaterThan(0);
  });

  it('should have crew member with name property', () => {
    expect(component.crewMembers[0].name).toBeDefined();
  });

  it('should have crew member with position property', () => {
    expect(component.crewMembers[0].position).toBeDefined();
  });

  it('should have crew member with image property', () => {
    expect(component.crewMembers[0].image).toBeDefined();
  });

  it('should render crew member cards', () => {
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('igx-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
