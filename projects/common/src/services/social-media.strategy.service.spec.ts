import { TestBed } from '@angular/core/testing';

import { SocialMediaStrategyService } from './social-media.strategy.service';

describe('SocialMedia.StrategyService', () => {
  let service: SocialMediaStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialMediaStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
