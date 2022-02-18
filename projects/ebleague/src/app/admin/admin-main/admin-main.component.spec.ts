import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainComponent } from './admin-main.component';

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
import { SizeNamePipe } from '../../pipes/size-name.pipe';

describe('AdminMainComponent', () => {
  let component: AdminMainComponent;
  let fixture: ComponentFixture<AdminMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminMainComponent,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
