import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { IgxChipsModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxDatePickerModule,
  IgxGridModule,
  IgxActionStripModule,
  IgxCheckboxModule} from '@infragistics/igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SizeNamePipe } from '../pipes/size-name.pipe';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        SizeNamePipe
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxChipsModule,
        IgxInputGroupModule,
        IgxButtonModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxDatePickerModule,
        IgxGridModule,
        IgxActionStripModule,
        IgxCheckboxModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
