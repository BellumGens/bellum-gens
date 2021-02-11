import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategyEditorComponent } from './strategy-editor.component';
import { IgxIconModule,
  IgxInputGroupModule,
  IgxListModule,
  IgxDragDropModule,
  IgxAvatarModule,
  IgxDialogModule,
  IgxCheckboxModule,
  IgxSelectModule,
  IgxButtonGroupModule,
  IgxButtonModule,
  IgxProgressBarModule} from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BellumGensModule } from 'src-common/lib/components.module';

describe('StrategyEditorComponent', () => {
  let component: StrategyEditorComponent;
  let fixture: ComponentFixture<StrategyEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
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
        BellumGensModule
      ],
      declarations: [ StrategyEditorComponent ]
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
