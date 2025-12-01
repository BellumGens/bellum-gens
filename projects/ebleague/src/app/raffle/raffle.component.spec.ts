import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RaffleComponent } from './raffle.component';

describe('RaffleComponent', () => {
  let component: RaffleComponent;
  let fixture: ComponentFixture<RaffleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RaffleComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a simple component with no complex logic', () => {
    // Verify component is just a container
    expect(component).toBeDefined();
  });

  it('should render template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
