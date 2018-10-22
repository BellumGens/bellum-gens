import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNotificationsComponent } from './team-notifications.component';

describe('TeamNotificationsComponent', () => {
  let component: TeamNotificationsComponent;
  let fixture: ComponentFixture<TeamNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
