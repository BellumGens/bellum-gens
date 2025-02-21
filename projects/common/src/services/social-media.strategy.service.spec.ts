import { TestBed } from '@angular/core/testing';
import { SocialMediaStrategyService } from './social-media.strategy.service';
import { CSGOStrategy, Side } from '../models/csgostrategy';
import { CSGOMap } from '../public_api';


describe('SocialMediaStrategyService', () => {
  let service: SocialMediaStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialMediaStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate strategy text for Twitter', () => {
    const strat: CSGOStrategy = {
      id: '1',
      title: 'test',
      owner: 'test',
      customUrl: 'test',
      teamId: '1',
      side: Side.TSide,
      description: 'test',
      url: 'test',
      map: CSGOMap.Dust2,
      visible: true
    };
    const expectedText = `Check out "${strat.title}" Counter-Strike strategy by ${strat.owner} on Bellum Gens https://bellumgens.com/strategies/details/${strat.customUrl}`;
    const generatedText = service['stratTextForTwitter'](strat);
    expect(generatedText).toEqual(expectedText);
    // Add more expectations for the generated strategy text
  });
});
