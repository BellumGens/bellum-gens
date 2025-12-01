import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnauthorizedComponent } from './unauthorized.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            UnauthorizedComponent
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default message', () => {
    expect(component.message).toBe('Unauthorized :(');
  });

  it('should update message from route params', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const customMessage = 'Access Denied';

    (activatedRoute.params as any).next({ message: customMessage });
    fixture.detectChanges();

    expect(component.message).toBe(customMessage);
  });

  it('should keep default message if no param provided', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);

    (activatedRoute.params as any).next({});
    fixture.detectChanges();

    expect(component.message).toBe('Unauthorized :(');
  });

  it('should display message in template', () => {
    component.message = 'Test Message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Message');
  });
});

import { ActivatedRoute } from '@angular/router';
