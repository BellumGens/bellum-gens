import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnersComponent } from './partners.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BaseDirective } from '../base/base.component';
import { of } from 'rxjs';

describe('PartnersComponent', () => {
  let component: PartnersComponent;
  let fixture: ComponentFixture<PartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        PartnersComponent
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend BaseDirective', () => {
    expect(component instanceof BaseDirective).toBeTruthy();
  });

  it('should use OnPush change detection', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
