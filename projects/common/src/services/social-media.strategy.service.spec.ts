import { TestBed } from '@angular/core/testing';
import { SocialMediaStrategyService } from './social-media.strategy.service';
import { PAGE_LOCATION } from './page-location';
import { CSGOStrategy, Side, CSGOMap } from 'bellum-gens-common/models';


describe('SocialMediaStrategyService', () => {
  let service: SocialMediaStrategyService;
  let location: { href: string };

  beforeEach(() => {
    // jsdom does not implement navigation, so the location the service writes is stubbed.
    location = { href: 'http://localhost:4200/strategies/details/test' };
    TestBed.configureTestingModule({
      providers: [{ provide: PAGE_LOCATION, useFactory: () => location }]
    });
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

  it('should open the Twitter share page with the strategy text', () => {
    const strat = { title: 'Rush B', owner: 'player', customUrl: 'rush-b' } as CSGOStrategy;

    service.shareOnTwitter(strat);

    expect(location.href).toBe(`https://twitter.com/intent/tweet?text=${service['stratTextForTwitter'](strat)}`);
  });
});
