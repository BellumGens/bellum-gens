import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSteamComponent } from './add-steam.component';

describe('AddSteamComponent', () => {
  let component: AddSteamComponent;
  let fixture: ComponentFixture<AddSteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
