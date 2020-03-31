import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTournamentsComponent } from './team-tournaments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IgxGridModule, IgxAvatarModule } from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            },
            data: new Observable()
          }
        }
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
