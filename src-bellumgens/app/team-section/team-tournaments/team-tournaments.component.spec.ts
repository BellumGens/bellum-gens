import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTournamentsComponent } from './team-tournaments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IgxGridModule, IgxAvatarModule } from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamTournamentsComponent', () => {
  let component: TeamTournamentsComponent;
  let fixture: ComponentFixture<TeamTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTournamentsComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        IgxGridModule,
        IgxAvatarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
