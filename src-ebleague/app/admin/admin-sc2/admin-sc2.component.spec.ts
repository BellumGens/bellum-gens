import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSc2Component } from './admin-sc2.component';
import { BellumGensModule } from 'src-common/lib/public_api';
import {
  IgxListModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxAvatarModule,
  IgxBadgeModule,
  IgxCardModule,
  IgxButtonModule,
  IgxDragDropModule,
  IgxProgressBarModule,
  IgxSelectModule,
  IgxTimePickerModule,
  IgxCalendarModule,
  IgxCheckboxModule,
  IgxGridModule,
  IgxDialogModule
} from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotInGroupPipe } from 'src-ebleague/app/pipes/not-in-group.pipe';

describe('AdminSc2Component', () => {
  let component: AdminSc2Component;
  let fixture: ComponentFixture<AdminSc2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminSc2Component,
        NotInGroupPipe
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        BellumGensModule,
        IgxListModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxAvatarModule,
        IgxBadgeModule,
        IgxCardModule,
        IgxButtonModule,
        IgxDragDropModule,
        IgxProgressBarModule,
        IgxSelectModule,
        IgxTimePickerModule,
        IgxCheckboxModule,
        IgxCalendarModule,
        IgxDialogModule,
        IgxGridModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
