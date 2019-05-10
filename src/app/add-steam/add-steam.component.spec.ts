import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSteamComponent } from './add-steam.component';
import { IgxIconModule } from 'igniteui-angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddSteamComponent', () => {
  let component: AddSteamComponent;
  let fixture: ComponentFixture<AddSteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxIconModule
      ],
      declarations: [ AddSteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
