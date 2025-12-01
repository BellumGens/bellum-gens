import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategyEditorComponent } from './strategy-editor.component';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxListModule } from '@infragistics/igniteui-angular/list';
import { IgxButtonModule, IgxDragDropModule } from '@infragistics/igniteui-angular/directives';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxDialogModule } from '@infragistics/igniteui-angular/dialog';
import { IgxCheckboxModule } from '@infragistics/igniteui-angular/checkbox';
import { IgxSelectModule } from '@infragistics/igniteui-angular/select';
import { IgxButtonGroupModule } from '@infragistics/igniteui-angular/button-group';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
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
        IgxIconModule,
        IgxInputGroupModule,
        IgxListModule,
        IgxDragDropModule,
        IgxAvatarModule,
        IgxDialogModule,
        IgxCheckboxModule,
        IgxSelectModule,
        IgxButtonGroupModule,
        IgxButtonModule,
        IgxProgressBarModule,
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
