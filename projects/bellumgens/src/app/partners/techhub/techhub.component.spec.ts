import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechhubComponent } from './techhub.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TechhubComponent', () => {
  let component: TechhubComponent;
  let fixture: ComponentFixture<TechhubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TechhubComponent],
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
