import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategyEditorComponent } from './strategy-editor.component';
import { IgxIconComponent, IGX_INPUT_GROUP_DIRECTIVES, IGX_LIST_DIRECTIVES, IgxButtonDirective, IGX_DRAG_DROP_DIRECTIVES, IgxAvatarComponent, IGX_DIALOG_DIRECTIVES, IgxCheckboxComponent, IGX_SELECT_DIRECTIVES, IgxButtonGroupComponent, IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StrategyEditorComponent', () => {
  let component: StrategyEditorComponent;
  let fixture: ComponentFixture<StrategyEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxIconComponent,
        IGX_INPUT_GROUP_DIRECTIVES,
        IGX_LIST_DIRECTIVES,
        IGX_DRAG_DROP_DIRECTIVES,
        IgxAvatarComponent,
        IGX_DIALOG_DIRECTIVES,
        IgxCheckboxComponent,
        IGX_SELECT_DIRECTIVES,
        IgxButtonGroupComponent,
        IgxButtonDirective,
        IgxCircularProgressBarComponent,
        StrategyEditorComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
