import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';
import { IGX_DIALOG_DIRECTIVES } from '@infragistics/igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        IGX_DIALOG_DIRECTIVES,
        ConfirmComponent
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title as empty string', () => {
    expect(component.title).toBe('');
  });

  it('should emit ok event when okClicked is called', (done) => {
    const testEntity = { id: 1, name: 'Test' };
    component.open(testEntity);

    component.ok.subscribe((entity) => {
      expect(entity).toEqual(testEntity);
      done();
    });

    component.okClicked();
  });

  it('should close dialog when okClicked is called', () => {
    spyOn(component.dialog, 'close');
    component.okClicked();
    expect(component.dialog.close).toHaveBeenCalled();
  });

  it('should emit cancel event when cancelClicked is called', (done) => {
    component.cancel.subscribe((args) => {
      expect(args).toBeDefined();
      done();
    });

    component.cancelClicked({} as any);
  });

  it('should close dialog when cancelClicked is called', () => {
    spyOn(component.dialog, 'close');
    component.cancelClicked({} as any);
    expect(component.dialog.close).toHaveBeenCalled();
  });

  it('should open dialog and store entity', () => {
    const testEntity = { id: 1, name: 'Test' };
    spyOn(component.dialog, 'open');

    component.open(testEntity);

    expect(component.dialog.open).toHaveBeenCalled();
    expect(component['confirmEntity']).toEqual(testEntity);
  });

  it('should clear confirmEntity on close', () => {
    component['confirmEntity'] = { id: 1 };
    component.onClose();
    expect(component['confirmEntity']).toBeNull();
  });

  it('should accept custom title', () => {
    component.title = 'Custom Confirmation';
    expect(component.title).toBe('Custom Confirmation');
  });
});
