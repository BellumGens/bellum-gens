import { CountrySVGPipe } from './country-svg.pipe';


describe('CountrySVGPipe', () => {
  let pipe: CountrySVGPipe;

  beforeEach(() => {
    pipe = new CountrySVGPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct SVG URL for a given country code', () => {
    expect(pipe.transform('Bulgaria')).toEqual('assets/country-flags/svg/bulgaria.svg');
    expect(pipe.transform('CA')).toEqual('assets/country-flags/svg/ca.svg');
    expect(pipe.transform('GB')).toEqual('assets/country-flags/svg/gb.svg');
  });

  it('should return an empty string if input is null or undefined', () => {
    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(undefined)).toEqual('');
  });
});
