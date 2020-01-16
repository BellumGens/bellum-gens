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
  IgxProgressBarModule} from 'igniteui-angular';

describe('AdminCsgoComponent', () => {
  let component: AdminCsgoComponent;
  let fixture: ComponentFixture<AdminCsgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCsgoComponent ],
      imports: [
        BellumGensModule,
        IgxListModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxAvatarModule,
        IgxBadgeModule,
        IgxCardModule,
        IgxButtonModule,
        IgxDragDropModule,
        IgxProgressBarModule
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
