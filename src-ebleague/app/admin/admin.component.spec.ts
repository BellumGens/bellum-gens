import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { IgxChipsModule, IgxInputGroupModule, IgxListModule, IgxButtonModule, IgxAvatarModule, IgxIconModule } from 'igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxChipsModule,
        IgxInputGroupModule,
        IgxListModule,
        IgxButtonModule,
        IgxAvatarModule,
        IgxIconModule
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
