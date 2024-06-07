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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SizeNamePipe } from '../../pipes/size-name.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminMainComponent', () => {
  let component: AdminMainComponent;
  let fixture: ComponentFixture<AdminMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxChipsModule,
        IgxInputGroupModule,
        IgxButtonModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxDatePickerModule,
        IgxGridModule,
        IgxActionStripModule,
        IgxCheckboxModule,
        AdminMainComponent,
        SizeNamePipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
