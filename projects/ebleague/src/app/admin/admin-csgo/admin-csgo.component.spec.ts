import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminCsgoComponent } from './admin-csgo.component';
import { BellumGensModule, ConfirmModule } from 'projects/common/src/public_api';
import { IgxListModule,
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
  IgxDialogModule} from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotInGroupPipe } from 'projects/ebleague/src/app/pipes/not-in-group.pipe';

describe('AdminCsgoComponent', () => {
  let component: AdminCsgoComponent;
  let fixture: ComponentFixture<AdminCsgoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCsgoComponent, NotInGroupPipe ],
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
        IgxCalendarModule,
        IgxCheckboxModule,
        IgxDialogModule,
        IgxGridModule,
        ConfirmModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCsgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
