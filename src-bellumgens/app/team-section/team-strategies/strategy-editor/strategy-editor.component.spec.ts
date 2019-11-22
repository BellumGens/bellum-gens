import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
  IgxProgressBarModule} from 'igniteui-angular';
import { ConfirmComponent } from 'src-bellumgens/app/confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StrategyEditorComponent', () => {
  let component: StrategyEditorComponent;
  let fixture: ComponentFixture<StrategyEditorComponent>;

  beforeEach(async(() => {
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
        IgxProgressBarModule
      ],
      declarations: [ StrategyEditorComponent, ConfirmComponent ]
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
