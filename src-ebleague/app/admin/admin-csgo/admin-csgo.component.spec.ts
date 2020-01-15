import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCsgoComponent } from './admin-csgo.component';

describe('AdminCsgoComponent', () => {
  let component: AdminCsgoComponent;
  let fixture: ComponentFixture<AdminCsgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCsgoComponent ]
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
