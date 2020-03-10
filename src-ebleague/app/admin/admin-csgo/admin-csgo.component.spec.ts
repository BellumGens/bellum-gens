import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCsgoComponent } from './admin-csgo.component';
import { BellumGensModule } from 'src-common/components/components.module';
import { IgxListModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxAvatarModule,
  IgxBadgeModule,
  IgxCardModule,
  IgxButtonModule,
  IgxDragDropModule,
  IgxProgressBarModule,
  IgxTabsModule,
  IgxSelectModule,
  IgxTimePickerModule,
  IgxCalendarModule} from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotInGroupPipe } from 'src-ebleague/app/pipes/not-in-group.pipe';

describe('AdminCsgoComponent', () => {
  let component: AdminCsgoComponent;
  let fixture: ComponentFixture<AdminCsgoComponent>;

  beforeEach(async(() => {
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
        IgxTabsModule,
        IgxTimePickerModule,
        IgxCalendarModule
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
