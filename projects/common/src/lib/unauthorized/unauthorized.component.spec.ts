import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnauthorizedComponent } from './unauthorized.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let paramsSubject: Subject<any>;

  beforeEach(waitForAsync(() => {
    paramsSubject = new Subject();

    TestBed.configureTestingModule({
        imports: [
            UnauthorizedComponent
        ],
        providers: [
            provideRouter([]),
            {
                provide: ActivatedRoute,
                useValue: {
                    params: paramsSubject.asObservable()
                }
            }
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
    const customMessage = 'Access Denied';

    paramsSubject.next({ message: customMessage });
    fixture.detectChanges();

    expect(component.message).toBe(customMessage);
  });

  it('should keep default message if no param provided', () => {
    paramsSubject.next({});
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
