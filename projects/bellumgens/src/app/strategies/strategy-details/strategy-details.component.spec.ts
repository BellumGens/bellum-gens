import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategyDetailsComponent } from './strategy-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GLOBAL_OVERLAY_SETTINGS, LoginService, NEW_EMPTY_COMMENT } from 'bellum-gens-common';

describe('StrategyDetailsComponent', () => {
  let component: StrategyDetailsComponent;
  let fixture: ComponentFixture<StrategyDetailsComponent>;
  let authService: LoginService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        StrategyDetailsComponent
      ]
    })
    .compileComponents();
    authService = TestBed.inject(LoginService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.newComment).toEqual(NEW_EMPTY_COMMENT);
    expect(component.overlaySettings).toEqual(GLOBAL_OVERLAY_SETTINGS);
  });

  it('should call resize method on window resize event', () => {
    spyOn(component, 'resize');
    window.dispatchEvent(new Event('resize'));
    expect(component.resize).toHaveBeenCalled();
  });

  it('should call openLogin method', () => {
    spyOn(authService.openLogin, 'emit');
    component.openLogin();
    expect(authService.openLogin.emit).toHaveBeenCalled();
  });

  // it('should call voteStrat method with correct parameters', () => {
  //   spyOn(component, 'voteStrat');
  //   const strat: CSGOStrategy = { /* create a mock CSGOStrategy object */ };
  //   const direction: VoteDirection = /* specify a vote direction */;
  //   component.voteStrat(strat, direction);
  //   expect(component.voteStrat).toHaveBeenCalledWith(strat, direction);
  // });

  // it('should call submitComment method', () => {
  //   spyOn(component, 'submitComment');
  //   component.submitComment();
  //   expect(component.submitComment).toHaveBeenCalled();
  // });

  // it('should call editComment method with correct parameter', () => {
  //   spyOn(component, 'editComment');
  //   const comment: StrategyComment = { /* create a mock StrategyComment object */ };
  //   component.editComment(comment);
  //   expect(component.editComment).toHaveBeenCalledWith(comment);
  // });

  // it('should call deleteComment method with correct parameter', () => {
  //   spyOn(component, 'deleteComment');
  //   const comment: StrategyComment = { /* create a mock StrategyComment object */ };
  //   component.deleteComment(comment);
  //   expect(component.deleteComment).toHaveBeenCalledWith(comment);
  // });

  // it('should call shareOnTwitter method with correct parameter', () => {
  //   spyOn(component, 'shareOnTwitter');
  //   const strat: CSGOStrategy = { /* create a mock CSGOStrategy object */ };
  //   component.shareOnTwitter(strat);
  //   expect(component.shareOnTwitter).toHaveBeenCalledWith(strat);
  // });
});
