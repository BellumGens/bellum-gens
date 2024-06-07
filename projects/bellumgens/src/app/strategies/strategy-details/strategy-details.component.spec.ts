import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategyDetailsComponent } from './strategy-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CSGOMap, CSGOStrategy, GLOBAL_OVERLAY_SETTINGS, LoginService, NEW_EMPTY_COMMENT, Side, SocialMediaStrategyService, StrategyComment, VoteDirection } from 'bellum-gens-common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StrategyDetailsComponent', () => {
  let component: StrategyDetailsComponent;
  let fixture: ComponentFixture<StrategyDetailsComponent>;
  let authService: LoginService;
  let smService: SocialMediaStrategyService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        StrategyDetailsComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
    authService = TestBed.inject(LoginService);
    smService = TestBed.inject(SocialMediaStrategyService);
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

  it('should call voteStrat method with correct parameters', () => {
    spyOn(component, 'voteStrat');
    const strat: CSGOStrategy = {
      id: '123456',
      title: 'Test 1',
      description: 'Test 2',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test.com'
    };
    const direction = VoteDirection.Up;
    component.voteStrat(strat, direction);
    expect(component.voteStrat).toHaveBeenCalledWith(strat, direction);
  });

  it('should call submitComment method', () => {
    spyOn(component, 'submitComment');
    component.submitComment();
    expect(component.submitComment).toHaveBeenCalled();
  });

  it('should call editComment method with correct parameter', () => {
    spyOn(component, 'editComment');
    const comment: StrategyComment = { id: '123', stratId: '456', comment: 'Test', userId: '123', published: new Date() };
    component.editComment(comment);
    expect(component.editComment).toHaveBeenCalledWith(comment);
  });

  it('should call deleteComment method with correct parameter', () => {
    spyOn(component, 'deleteComment');
    const comment: StrategyComment = { id: '123', stratId: '456', comment: 'Test', userId: '123', published: new Date() };
    component.deleteComment(comment);
    expect(component.deleteComment).toHaveBeenCalledWith(comment);
  });

  it('should call shareOnTwitter method with correct parameter', () => {
    spyOn(smService, 'shareOnTwitter');
    const strat: CSGOStrategy = {
      id: '123456',
      title: 'Test 1',
      description: 'Test 2',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test.com'
    };
    component.shareOnTwitter(strat);
    expect(smService.shareOnTwitter).toHaveBeenCalledWith(strat);
  });

  // TODO: Add more test cases with UI interactions
});
