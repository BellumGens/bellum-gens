import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitStaraZagoraComponent } from './visit-stara-zagora.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('VisitStaraZagoraComponent', () => {
  let component: VisitStaraZagoraComponent;
  let fixture: ComponentFixture<VisitStaraZagoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, VisitStaraZagoraComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStaraZagoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here
});
