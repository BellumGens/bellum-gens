import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminCsgoComponent } from './admin-csgo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminCsgoComponent', () => {
  let component: AdminCsgoComponent;
  let fixture: ComponentFixture<AdminCsgoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        AdminCsgoComponent
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
