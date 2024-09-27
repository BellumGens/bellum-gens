import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechhubComponent } from './techhub.component';

describe('TechhubComponent', () => {
  let component: TechhubComponent;
  let fixture: ComponentFixture<TechhubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechhubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechhubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here as needed
});
