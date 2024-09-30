import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulstreamComponent } from './bulstream.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BulstreamComponent', () => {
  let component: BulstreamComponent;
  let fixture: ComponentFixture<BulstreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, BulstreamComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulstreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here
});
