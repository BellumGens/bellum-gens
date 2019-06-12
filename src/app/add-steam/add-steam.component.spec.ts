import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSteamComponent } from './add-steam.component';
import { IgxIconModule, IgxButtonModule, IgxDividerModule } from 'igniteui-angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddSteamComponent', () => {
  let component: AddSteamComponent;
  let fixture: ComponentFixture<AddSteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxIconModule,
        IgxDividerModule,
        IgxButtonModule
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
