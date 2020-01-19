import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { IgxChipsModule,
  IgxInputGroupModule,
  IgxListModule,
  IgxButtonModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxDatePickerModule } from 'igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxChipsModule,
        IgxInputGroupModule,
        IgxListModule,
        IgxButtonModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxDatePickerModule
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