import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TeamComponent } from "./team.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { ApplicationUser, CSGOTeam, TEAM_PLACEHOLDER } from "bellum-gens-common";

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a placeholder team initially', () => {
    expect(component.team).toEqual(TEAM_PLACEHOLDER);
  });

  // it('should set the authenticated user', () => {
  //   const mockUser: ApplicationUser = { id: 1, name: 'John Doe' };
  //   component.authUser = mockUser;
  //   expect(component.authUser).toEqual(mockUser);
  // });

  // it('should call the BellumgensApiService to load team data', () => {
  //   const mockTeam: CSGOTeam = { id: 1, name: 'Team A' };
  //   spyOn(component.apiService, 'getTeam').and.returnValue(of(mockTeam));
  //   component.ngOnInit();
  //   expect(component.team).toEqual(mockTeam);
  //   expect(component.apiService.getTeam).toHaveBeenCalled();
  // });

  // it('should set isAdmin to true if the authenticated user is an admin', () => {
  //   const mockUser: ApplicationUser = { id: 1, name: 'John Doe', isAdmin: true };
  //   component.authUser = mockUser;
  //   expect(component.isAdmin).toBeTrue();
  // });

  // it('should set isMember to true if the authenticated user is a member of the team', () => {
  //   const mockUser: ApplicationUser = { id: 1, name: 'John Doe', teamId: 1 };
  //   component.authUser = mockUser;
  //   component.team = { id: 1, name: 'Team A' };
  //   expect(component.isMember).toBeTrue();
  // });
});
