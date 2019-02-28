import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNotificationsComponent } from './notifications.component';
import { IgxProgressBarModule, IgxListModule, IgxAvatarModule } from 'igniteui-angular';
import { DisabledNotificationsPipe } from 'src/app/pipes/disabled-notifications.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { SortNotificationsPipe } from 'src/app/pipes/sort-notifications.pipe';

describe('NotificationsComponent', () => {
  let component: PlayerNotificationsComponent;
  let fixture: ComponentFixture<PlayerNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IgxListModule,
        IgxProgressBarModule,
        IgxAvatarModule
      ],
      declarations: [
        PlayerNotificationsComponent,
        DisabledNotificationsPipe,
        SortNotificationsPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
